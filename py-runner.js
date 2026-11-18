/* =====================================================================
   py-runner.js —— 页面上「▶ 运行」按钮的全部逻辑（主线程侧）
   用法：
     PyRun.mount(el, { code: "print(1)", editable: true })   // 可编辑
     PyRun.autoMount()                                       // 自动扫描：
        pre.codeblock[data-run]  → 右上角加运行按钮（只读）
        [data-py-edit]           → 变成可编辑的运行器（代码从 data-py-edit 取）
   真正的 Python 在 py-runner-worker.js 里跑，这里只负责界面和超时控制。
   ===================================================================== */
(function () {
  "use strict";
  if (window.PyRun) return;

  var TIMEOUT_MS = 10000;     // 跑代码的时限（不含首次下载环境）
  var worker = null;
  var busy = false;           // 全局同时只跑一段
  var cur = null;             // 当前这次运行的回调
  var timer = null;
  var everLoaded = false;

  /* ---------------- 样式（一次注入，两页通用） ---------------- */
  var CSS = [
    ".py-box{margin:12px 0 16px;background:#0f172a;border:1px solid #1e293b;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(15,23,42,.12)}",
    ".py-bar{display:flex;align-items:center;gap:10px;padding:8px 10px;background:#111c2e;border-bottom:1px solid #1e293b;flex-wrap:wrap}",
    ".py-go{border:none;cursor:pointer;background:#10b981;color:#fff;font-size:12.5px;font-weight:700;padding:5px 13px;border-radius:6px;font-family:inherit;transition:background .15s}",
    ".py-go:hover{background:#059669}",
    ".py-go[disabled]{background:#334155;color:#94a3b8;cursor:wait}",
    ".py-reset{border:1px solid #334155;background:transparent;color:#94a3b8;font-size:11.5px;padding:3px 9px;border-radius:6px;cursor:pointer;font-family:inherit;margin-left:auto}",
    ".py-reset:hover{color:#e2e8f0;border-color:#475569}",
    ".py-tip{font-size:11.5px;color:#94a3b8;line-height:1.5}",
    ".py-code{display:block;width:100%;box-sizing:border-box;border:none;outline:none;resize:vertical;background:#0f172a;color:#e2e8f0;padding:12px 14px;font-family:Consolas,Menlo,\"Cascadia Mono\",monospace;font-size:13.5px;line-height:1.7;min-height:70px;tab-size:4;white-space:pre;overflow-x:auto}",
    ".py-code::selection{background:#2563eb}",
    ".py-out{border-top:1px solid #1e293b;background:#0b1220;padding:10px 14px 12px}",
    ".py-out-h{display:flex;align-items:center;gap:8px;font-size:11px;color:#64748b;letter-spacing:.08em;margin-bottom:4px}",
    ".py-out-h b{color:#34d399;font-weight:600;letter-spacing:0}",
    ".py-out pre{margin:0;font-family:Consolas,Menlo,monospace;font-size:13px;line-height:1.65;color:#e2e8f0;white-space:pre-wrap;word-break:break-word;max-height:320px;overflow:auto}",
    ".py-err{color:#fca5a5!important;margin-top:6px!important;border-top:1px dashed #334155;padding-top:6px}",
    ".py-empty{color:#64748b;font-style:italic}",
    ".py-loading b{display:inline-block;animation:pyDot 1.2s infinite}",
    "@keyframes pyDot{0%,100%{opacity:.25}50%{opacity:1}}",
    ".run-code{position:absolute;top:8px;right:72px;z-index:2;font-size:11px;padding:2px 9px;border-radius:12px;cursor:pointer;border:1px solid #475569;background:rgba(30,41,59,.85);color:#cbd5e1;font-family:inherit}",
    ".run-code:hover{color:#fff;border-color:#94a3b8}",
    ".code-wrap .run-out{position:relative;margin:-2px 0 10px;background:#0b1220;border-radius:8px;padding:10px 14px}",
    ".code-wrap .run-out pre{margin:0;font-family:Consolas,Menlo,monospace;font-size:13px;line-height:1.65;color:#e2e8f0;white-space:pre-wrap;word-break:break-word;max-height:300px;overflow:auto}",
    ".code-wrap .run-out .py-out-h{margin-bottom:4px}"
  ].join("\n");

  function injectCss() {
    if (document.getElementById("py-runner-css")) return;
    var st = document.createElement("style");
    st.id = "py-runner-css";
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ---------------- Worker 生命周期 ---------------- */
  function killWorker() {
    if (worker) { try { worker.terminate(); } catch (e) {} }
    worker = null;
  }

  function ensureWorker() {
    if (worker) return true;
    try {
      var url = "py-runner-worker.js";
      worker = new Worker(url);
    } catch (e) {
      worker = null;
      return false;
    }
    worker.onmessage = onWorkerMessage;
    worker.onerror = function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      fail("运行环境加载失败（" + ((ev && ev.message) || "网络或文件问题") + "）。\n如果是本地双击打开的网页，浏览器不允许加载后台脚本，请用线上地址访问。");
    };
    return true;
  }

  function clearTimer() {
    if (timer) { clearTimeout(timer); timer = null; }
  }

  function startTimer() {
    clearTimer();
    timer = setTimeout(function () {
      killWorker();               // 直接杀掉后台线程，死循环也拦得住
      fail("跑了超过 " + Math.round(TIMEOUT_MS / 1000) + " 秒还没结束，已经强制停下。\n检查一下是不是写了死循环（比如 while True 忘了写退出条件）。");
      everLoaded = true;          // 环境其实已经下好了，下次不用再等
    }, TIMEOUT_MS);
  }

  function onWorkerMessage(e) {
    var m = e.data || {};

    /* 预热也可能触发 ready / fatal，这两种要脱离 cur 单独处理 */
    if (m.type === "ready") everLoaded = true;
    if (m.type === "fatal") {
      clearTimer();
      killWorker();
      fail(m.message || "运行环境出问题");
      return;
    }
    if (!cur) return;

    if (m.type === "boot") {
      clearTimer();
      cur.status("首次运行要先下载 Python 运行环境（约 6–10 MB），大概 5–10 秒，之后就不用了…");
      return;
    }
    if (m.type === "ready") {
      everLoaded = true;
      cur.status("环境就绪，正在跑…");
      startTimer();
      return;
    }
    if (m.type === "status") { cur.status(m.text); return; }
    if (m.type === "out") { cur.out(m.text); return; }
    if (m.type === "err") { cur.out(m.text); return; }
    if (m.type === "done") {
      clearTimer();
      if (m.ok) cur.done(null, m.repr);
      else cur.done(m.error || "出错了");
      return;
    }
    if (m.type === "fatal") {
      clearTimer();
      killWorker();
      fail(m.message || "运行环境出问题");
    }
  }

  /* ---------------- 一次运行 ---------------- */
  function fail(msg) {
    if (cur) { cur.done(msg); }
    else { alert(msg); }
  }

  /* hooks: {status, out, done, onEnd} */
  function exec(code, hooks) {
    if (busy) {
      hooks.status("上一段代码还在跑，等它结束再点。");
      return;
    }
    injectCss();
    if (!ensureWorker()) {
      hooks.done("运行环境加载失败：浏览器不允许这里用后台脚本。请通过线上地址（http/https）打开页面，本地双击的 file:// 页面不支持运行。");
      return;
    }
    busy = true;
    cur = hooks;
    hooks.status(everLoaded ? "正在跑…" : "正在准备运行环境…");
    startTimer();
    try {
      worker.postMessage({ type: "run", code: code });
    } catch (err) {
      clearTimer();
      busy = false;
      cur = null;
      hooks.done("发送代码失败：" + (err && err.message));
    }
  }

  function finish() {
    clearTimer();
    busy = false;
    cur = null;
  }

  /* ---------------- 可编辑运行器 ---------------- */
  function mount(el, opts) {
    if (!el) return;
    injectCss();
    var code = (opts && opts.code) || "";
    var tip = (opts && opts.tip) || "代码可以随便改，改完点运行";
    el.innerHTML = "";

    var box = document.createElement("div");
    box.className = "py-box";

    var bar = document.createElement("div");
    bar.className = "py-bar";

    var go = document.createElement("button");
    go.type = "button";
    go.className = "py-go";
    go.textContent = "▶ 运行";

    var tipEl = document.createElement("span");
    tipEl.className = "py-tip";
    tipEl.textContent = tip;

    var reset = document.createElement("button");
    reset.type = "button";
    reset.className = "py-reset";
    reset.textContent = "还原代码";

    bar.appendChild(go);
    bar.appendChild(tipEl);
    bar.appendChild(reset);

    var ta = document.createElement("textarea");
    ta.className = "py-code";
    ta.spellcheck = false;
    ta.setAttribute("autocapitalize", "off");
    ta.setAttribute("autocorrect", "off");
    ta.value = code;
    ta.rows = Math.max(3, code.split("\n").length);

    var outWrap = document.createElement("div");
    outWrap.className = "py-out";
    outWrap.hidden = true;
    var outHead = document.createElement("div");
    outHead.className = "py-out-h";
    outHead.innerHTML = '<b>输出</b><span class="py-tip">Pyodide · 真实 CPython</span>';
    var stdout = document.createElement("pre");
    var errEl = document.createElement("pre");
    errEl.className = "py-err";
    errEl.hidden = true;
    outWrap.appendChild(outHead);
    outWrap.appendChild(stdout);
    outWrap.appendChild(errEl);

    box.appendChild(bar);
    box.appendChild(ta);
    box.appendChild(outWrap);
    el.appendChild(box);

    /* Tab 键插入 4 个空格，别让焦点跳走 */
    ta.addEventListener("keydown", function (ev) {
      if (ev.key === "Tab") {
        ev.preventDefault();
        var s = ta.selectionStart, e2 = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(e2);
        ta.selectionStart = ta.selectionEnd = s + 4;
      }
      if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
        ev.preventDefault();
        go.click();
      }
    });

    reset.addEventListener("click", function () {
      ta.value = code;
      ta.rows = Math.max(3, code.split("\n").length);
      outWrap.hidden = true;
      stdout.textContent = "";
      errEl.hidden = true;
    });

    go.addEventListener("click", function () {
      if (busy) { tipEl.textContent = "上一段还在跑，稍等一下"; return; }
      var src = ta.value;
      if (!src.trim()) { tipEl.textContent = "先写点代码再运行"; return; }
      outWrap.hidden = false;
      stdout.className = "py-empty";
      stdout.textContent = "";
      errEl.hidden = true;
      go.disabled = true;
      tipEl.className = "py-tip py-loading";
      tipEl.innerHTML = "<b>·</b> 准备中";

      var first = true;
      exec(src, {
        status: function (t) {
          tipEl.className = "py-tip py-loading";
          tipEl.innerHTML = "<b>·</b> " + t;
        },
        out: function (t) {
          if (first) { stdout.className = ""; stdout.textContent = ""; first = false; }
          stdout.textContent += t;
          stdout.scrollTop = stdout.scrollHeight;
        },
        done: function (err, repr) {
          go.disabled = false;
          tipEl.className = "py-tip";
          if (err) {
            tipEl.textContent = err.indexOf("强制停下") > -1 ? "已强制停下" : "出错了";
            errEl.hidden = false;
            errEl.textContent = err;
            if (first) { stdout.className = "py-empty"; stdout.textContent = "（没有输出）"; }
          } else {
            tipEl.textContent = "跑完了 ✓";
            if (first) { stdout.className = "py-empty"; stdout.textContent = "（这段代码没有 print，所以没有输出）"; }
            if (repr) {
              stdout.textContent += "\n# 最后一行表达式的值：" + repr;
            }
          }
          finish();
        }
      });
    });
  }

  /* ---------------- 只读代码块：右上角加运行 ---------------- */
  function attachRun(pre) {
    var wrap = pre.parentNode;
    if (!wrap || !wrap.classList.contains("code-wrap")) {
      wrap = document.createElement("div");
      wrap.className = "code-wrap";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
    }

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "run-code";
    btn.textContent = "▶ 运行";
    wrap.appendChild(btn);

    var outWrap = null;
    var stdout = null;
    var errEl = null;

    function buildOut() {
      outWrap = document.createElement("div");
      outWrap.className = "run-out";
      var head = document.createElement("div");
      head.className = "py-out-h";
      head.innerHTML = '<b>输出</b><span class="py-tip">Pyodide · 真实 CPython</span>';
      stdout = document.createElement("pre");
      errEl = document.createElement("pre");
      errEl.className = "py-err";
      errEl.hidden = true;
      outWrap.appendChild(head);
      outWrap.appendChild(stdout);
      outWrap.appendChild(errEl);
      wrap.parentNode.insertBefore(outWrap, wrap.nextSibling);
      injectCss();
    }

    btn.addEventListener("click", function () {
      if (busy) { btn.textContent = "等上一段跑完"; setTimeout(function () { btn.textContent = "▶ 运行"; }, 1200); return; }
      if (!outWrap) buildOut();
      errEl.hidden = true;
      stdout.className = "py-empty";
      stdout.textContent = "";
      btn.disabled = true;
      btn.textContent = "准备中…";

      var first = true;
      exec(pre.textContent, {
        status: function (t) { btn.textContent = "准备中…"; stdout.className = "py-empty"; stdout.textContent = t; },
        out: function (t) {
          if (first) { stdout.className = ""; stdout.textContent = ""; first = false; }
          stdout.textContent += t;
        },
        done: function (err, repr) {
          btn.disabled = false;
          btn.textContent = "▶ 运行";
          if (err) {
            errEl.hidden = false;
            errEl.textContent = err;
            if (first) { stdout.className = "py-empty"; stdout.textContent = "（没有输出）"; }
          } else if (first) {
            stdout.className = "py-empty";
            stdout.textContent = "（这段代码没有 print，所以没有输出）";
          } else if (repr) {
            stdout.textContent += "\n# 最后一行表达式的值：" + repr;
          }
          finish();
        }
      });
    });
  }

  function autoMount() {
    injectCss();
    document.querySelectorAll("pre.codeblock[data-run]").forEach(function (pre) {
      if (pre.dataset.runMounted) return;
      pre.dataset.runMounted = "1";
      attachRun(pre);
    });
    document.querySelectorAll("[data-py-edit]").forEach(function (el) {
      if (el.dataset.pyMounted) return;
      el.dataset.pyMounted = "1";
      mount(el, { code: el.dataset.pyEdit || "" });
    });
  }

  /* ---------------- 预热（可选）：进入页面 1 秒后悄悄下载环境 ---------------- */
  function warm() {
    if (busy || everLoaded) return;
    if (!ensureWorker()) return;
    try { worker.postMessage({ type: "warm" }); } catch (e) {}
  }

  window.PyRun = {
    mount: mount,
    autoMount: autoMount,
    warm: warm,
    isBusy: function () { return busy; }
  };
})();
