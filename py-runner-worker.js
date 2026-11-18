/* =====================================================================
   py-runner-worker.js —— 真正执行 Python 的地方
   用 Pyodide（把 CPython 编译成 WebAssembly）在后台线程跑代码。
   放在独立 Worker 里有两个好处：
     1. 死循环卡不住页面（主线程收到超时就直接 terminate 掉这个线程）
     2. 页面滚动、打字不受影响
   ===================================================================== */

var VERSION = "0.26.4";
var SOURCES = [
  "https://cdn.jsdelivr.net/pyodide/v" + VERSION + "/full/",
  "https://fastly.jsdelivr.net/pyodide/v" + VERSION + "/full/",
  "https://gcore.jsdelivr.net/pyodide/v" + VERSION + "/full/"
];

var pyodide = null;
var bootPromise = null;

function send(msg) {
  self.postMessage(msg);
}

/* 保证只会下载一次：预热和「运行」同时来也不会重复加载 */
function getPy() {
  if (pyodide) return Promise.resolve(pyodide);
  if (!bootPromise) {
    bootPromise = boot().then(function (p) { pyodide = p; return p; }, function (e) {
      bootPromise = null;
      throw e;
    });
  }
  return bootPromise;
}

/* 预置：把 input() 换成一个说人话的报错。
   网页里没有交互终端，input() 真的没法停下来等你敲字。 */
var PRELUDE = [
  "import builtins",
  "def _py_typing_no_input(prompt=''):",
  "    raise RuntimeError('这段代码用到了 input()。网页里没法真的停下来等你输入，把 input(...) 换成一个固定值再跑，比如 name = \"小明\"。')",
  "builtins.input = _py_typing_no_input"
].join("\n");

/* 依次尝试几个 CDN，谁先通用谁 */
async function boot() {
  var lastErr = null;
  for (var i = 0; i < SOURCES.length; i++) {
    var base = SOURCES[i];
    try {
      send({ type: "status", text: "下载 Python 运行环境（源 " + (i + 1) + "/" + SOURCES.length + "）…" });
      importScripts(base + "pyodide.js");
      var py = await loadPyodide({ indexURL: base });
      py.setStdout({ batched: function (s) { send({ type: "out", text: s + "\n" }); } });
      py.setStderr({ batched: function (s) { send({ type: "err", text: s + "\n" }); } });
      py.runPython(PRELUDE);
      return py;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("下载 Python 运行环境失败");
}

/* 把 Python 那串 traceback 修剪成人能看的样子：
   只留用户代码（<exec>）相关的帧，pyodide 内部帧全部藏掉 */
function tidy(raw) {
  var s = String(raw || "");
  var lines = s.split("\n");
  var keep = [];
  var skipping = false;
  for (var i = 0; i < lines.length; i++) {
    var ln = lines[i];
    var m = ln.match(/^\s*File "([^"]+)"/);
    if (m) {
      /* 用户代码的文件名可能是 <exec> / <string>，这些帧要保留 */
      skipping = !(/<(exec|string|module)>/.test(m[1]));
      if (!skipping) keep.push(ln);
      continue;
    }
    if (skipping) {
      /* 内部帧的代码行、^^^ 指示行都跳过；遇到异常名行（顶格）恢复 */
      if (/^\s/.test(ln) || /^\s*\^+\s*$/.test(ln)) continue;
      skipping = false;
    }
    keep.push(ln);
  }
  s = keep.join("\n").replace(/\/lib\/python3\d*\.zip\//g, "").replace(/\n{3,}/g, "\n\n").trim();
  if (s.length > 1200) s = s.slice(0, 1200) + "\n……（报错太长，后面省略）";
  return s;
}

self.onmessage = async function (e) {
  var m = e.data || {};

  if (m.type === "warm") {
    /* 预热：只下载环境，不跑代码 */
    if (pyodide) { send({ type: "ready", warm: true }); return; }
    try {
      send({ type: "boot" });
      await getPy();
      send({ type: "ready", warm: true });
    } catch (err) {
      send({ type: "fatal", message: tidy(err && err.message || err) });
    }
    return;
  }

  if (m.type !== "run") return;

  try {
    if (!pyodide) {
      send({ type: "boot" });
      await getPy();
      send({ type: "ready" });
    }
    send({ type: "status", text: "运行中…" });

    var result;
    try {
      result = await pyodide.runPythonAsync(m.code);
    } catch (err) {
      send({ type: "done", ok: false, error: tidy(err && (err.message || err)) });
      return;
    }

    var repr = null;
    if (result !== undefined && result !== null) {
      try {
        repr = String(result);
        if (repr === "None") repr = null;
      } catch (_) { repr = null; }
    }
    send({ type: "done", ok: true, repr: repr });
  } catch (err) {
    send({ type: "fatal", message: tidy(err && (err.message || err)) });
  }
};
