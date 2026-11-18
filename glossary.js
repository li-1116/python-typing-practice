/* =====================================================================
   glossary.js —— 纯本地翻译引擎（不联网、不调大模型、不吃 Key）
   目标：把教材里的代码和变量名翻成中文人话
     PyGloss.translate(text)  → { kind, lines, words, note }
         kind = "code" | "name" | "sentence" | "empty"
   ===================================================================== */
(function () {
  "use strict";
  if (window.PyGloss) return;

  /* ---------------- 词表：变量名 / 参数名里出现的英文 ---------------- */
  var WORDS = {
    milk: "牛奶", tea: "茶", "milk_tea": "奶茶", coffee: "咖啡", juice: "果汁",
    price: "价格", cost: "成本", money: "钱", total: "总计", sum: "总和",
    count: "数量", num: "数量", amount: "金额", quantity: "数量",
    cart: "购物车", item: "商品", items: "商品列表", goods: "商品", order: "订单",
    score: "分数", scores: "分数列表", grade: "成绩", level: "等级",
    pass: "及格", passed: "及格", "pass_score": "及格线", "passed_count": "及格人数",
    "passed_scores": "及格的分数", "fail": "不及格",
    name: "名字", age: "年龄", user: "用户", student: "学生", students: "学生列表",
    teacher: "老师", people: "人", person: "人", kids: "孩子们",
    height: "身高", weight: "体重", points: "积分", discount: "折扣", tax: "税",
    days: "天数", day: "天", week: "周", month: "月", year: "年",
    hour: "小时", minute: "分钟", second: "秒", time: "时间", date: "日期",
    start: "开始", end: "结束", begin: "开始", finish: "结束",
    text: "文本", "text_score": "文本分数", word: "单词", words: "单词列表",
    sentence: "句子", clean: "清理后的", raw: "原始", "raw_text": "原始文本",
    data: "数据", result: "结果", value: "值", values: "值列表", var: "变量",
    input: "输入", output: "输出", temp: "临时", tmp: "临时",
    average: "平均分", avg: "平均", mean: "平均", max: "最大值", min: "最小值",
    limit: "上限", threshold: "门槛", first: "第一个", last: "最后一个",
    index: "下标", key: "键", val: "值", pair: "一对",
    left: "左边", right: "右边", top: "顶部", bottom: "底部",
    width: "宽度", height2: "高度", area: "面积", length: "长度",
    chinese: "语文", math: "数学", english: "英语", science: "科学",
    python: "Python", code: "代码", file: "文件", path: "路径",
    line: "行", lines: "行列表", content: "内容", body: "正文",
    ok: "成功", flag: "标记", check: "检查", valid: "有效", invalid: "无效",
    open: "打开", close: "关闭", read: "读取", write: "写入",
    add: "添加", remove: "删除", update: "更新", find: "查找",
    search: "搜索", sort: "排序", filter: "筛选",
    run: "运行", test: "测试", main: "主", init: "初始化",
    new: "新的", old: "旧的", other: "其他", same: "相同",
    person2: "人", people2: "人们", week2: "周",
    total_price: "总价", unit_price: "单价", "unit_cost": "单件成本",
    "is_pass": "是否及格", is_ok: "是否成功", is_valid: "是否有效",
    status: "状态", type: "类型", kind: "种类", mode: "模式",
    page: "页码", size: "大小", rank: "排名", list: "列表", dict: "字典",
    menu: "菜单", shop: "商店", store: "商店", bank: "银行", account: "账户",
    balance: "余额", salary: "工资", bonus: "奖金", fee: "费用",
    ticket: "票", seat: "座位", room: "房间", floor: "楼层",
    animal: "动物", cat: "猫", dog: "狗", fruit: "水果", apple: "苹果",
    banana: "香蕉", egg: "鸡蛋", bread: "面包", rice: "米饭", book: "书",
    books: "书", course: "课程", lesson: "课", homework: "作业", exam: "考试",
    /* 英文讲解里常见的词（划词翻译用） */
    understand: "理解", try: "尝试", loop: "循环", condition: "条件",
    never: "从不", stop: "停止", error: "错误", wrong: "错的", correct: "正确的",
    each: "每个", every: "每个", all: "全部", some: "一些", next: "下一个",
    previous: "上一个", true: "真", false: "假", string: "字符串", number: "数字",
    function: "函数", method: "方法", variable: "变量", dictionary: "字典",
    tuple: "元组", boolean: "布尔值", statement: "语句", expression: "表达式",
    operator: "运算符", indent: "缩进", block: "代码块", syntax: "语法",
    runtime: "运行时", bug: "缺陷", debug: "调试", fix: "修复",
    case: "情况", example: "例子", compare: "比较", calculate: "计算",
    because: "因为", mean: "意思是", means: "意思是", instead: "而是",
    inside: "在内部", outside: "在外部", before: "在之前", after: "在之后",
    again: "再一次", only: "只有", also: "也", same: "相同的", different: "不同的"
  };

  /* API：内置函数与方法 → 人话（用于逐词标注和表达式翻译） */
  var API = {
    print: "打印输出", input: "等键盘输入", len: "取长度", range: "生成一串数字",
    int: "转成整数", str: "转成文本", float: "转成小数", list: "转成列表",
    sum: "求和", max: "取最大值", min: "取最小值", abs: "取绝对值",
    round: "四舍五入", sorted: "排序后返回", type: "看类型", bool: "转成真假",
    append: "往末尾加一个", remove: "删掉指定项", pop: "取出并删除", insert: "插入到指定位置",
    sort: "就地排序", reverse: "反转顺序", clear: "清空", copy: "复制一份",
    keys: "取出所有键", values: "取出所有值", items: "取出键值对",
    get: "按键取值", update: "更新内容", setdefault: "没这个键就设默认值",
    strip: "去掉首尾空格", split: "按分隔符切开", join: "用分隔符拼起来",
    replace: "替换", lower: "转小写", upper: "转大写", title: "首字母大写",
    startswith: "是否以它开头", endswith: "是否以它结尾", count2: "数出现几次",
    format: "填进模板", find: "查找位置", encode: "编码", decode: "解码",
    open: "打开文件", read: "读全部内容", readlines: "按行读成列表",
    write: "写入内容", close_file: "关闭文件",
    assert: "检查是否成立", enumerate: "同时给出下标和值", zip: "把多个列表配对",
    isinstance: "判断是不是某种类型", super: "调用父类", init: "初始化"
  };

  /* 英文句子里的功能词，翻出来反而怪，直接跳过 */
  var STOP = {
    a: 1, an: 1, the: 1, is: 1, are: 1, was: 1, were: 1, be: 1, been: 1,
    to: 1, of: 1, in: 1, on: 1, at: 1, by: 1, for: 1, with: 1, from: 1,
    this: 1, that: 1, these: 1, those: 1, it: 1, its: 1, as: 1, and: 1,
    or: 1, but: 1, so: 1, if: 1, then: 1, when: 1, will: 1, can: 1, may: 1,
    should: 1, would: 1, you: 1, we: 1, they: 1, he: 1, she: 1, i: 1, my: 1
  };

  /* 常见动词前缀：拼在变量/函数名开头时按中文习惯翻 */
  var VERBS = {
    get: "获取", set: "设置", is: "是否", has: "是否含有", can: "能否",
    calc: "计算", compute: "计算", make: "生成", build: "生成", create: "创建",
    check: "检查", verify: "校验", find: "查找", search: "搜索", parse: "解析",
    format: "格式化", render: "渲染", load: "加载", save: "保存", send: "发送",
    fetch: "获取", update: "更新", add: "添加", remove: "删除", delete: "删除",
    to: "转成", from: "从", of: "的", with: "带", by: "按",
    self: "自己", init: "初始化", main: "主", test: "测试"
  };

  /* ---------------- 基础工具 ---------------- */
  function zhName(ident) {
    var s = String(ident || "");
    if (!s) return null;
    var low = s.replace(/^_+/, "").toLowerCase();
    if (!low) return null;
    if (WORDS[low]) return WORDS[low];
    if (VERBS[low]) return VERBS[low];
    var parts = low.split("_").filter(Boolean);
    if (!parts.length) return null;
    var out = [], hit = 0, i = 0;
    while (i < parts.length) {
      var two = parts[i] + "_" + parts[i + 1];
      if (i + 1 < parts.length && WORDS[two]) { out.push(WORDS[two]); i += 2; hit++; continue; }
      var one = WORDS[parts[i]] || VERBS[parts[i]];
      if (one) { out.push(one); hit++; }
      else out.push(parts[i]);
      i++;
    }
    if (!hit) return null;
    return out.join("");
  }

  /* 去掉行尾注释（引号内的 # 不算） */
  function splitComment(line) {
    var q = null;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (q) { if (c === q && line[i - 1] !== "\\") q = null; continue; }
      if (c === '"' || c === "'") { q = c; continue; }
      if (c === "#") return { body: line.slice(0, i).replace(/\s+$/, ""), comment: line.slice(i + 1).trim() };
    }
    return { body: line, comment: "" };
  }

  /* 把 a == b / >= / and 之类换成中文 */
  var OPS = [
    ["==", " 等于 "], ["!=", " 不等于 "], [">=", " 大于等于 "], ["<=", " 小于等于 "],
    [">", " 大于 "], ["<", " 小于 "], ["+=", " 加上 "], ["-=", " 减去 "],
    [" and ", " 并且 "], [" or ", " 或者 "], [" not ", " 不 "],
    ["+", " 加 "], ["-", " 减 "], ["*", " 乘 "], ["/", " 除以 "],
    ["//", " 整除 "], ["%", " 取余 "], ["**", " 的几次方 "]
  ];

  /* 标识符 -> 中文（查不到就留原文） */
  function zhIdent(ident) {
    var z = zhName(ident);
    return z ? z : ident;
  }

  /* 带点的路径：self.name -> 自己 的 名字 */
  function zhPath(p) {
    return String(p).split(".").map(function (seg) {
      return zhName(seg) || API[seg] || seg;
    }).join(" 的 ");
  }

  /* 表达式轻翻译：词表 + API + 运算符 */
  function zhExpr(e) {
    var s = String(e || "").trim();
    if (!s) return "";
    if (s === "True") return "真（成立）";
    if (s === "False") return "假（不成立）";
    if (s === "None") return "空值（None）";
    if (/^["'].*["']$/.test(s)) return "文本 " + s;
    if (/^-?\d+(\.\d+)?$/.test(s)) return s;

    /* 列表推导式：[x for x in 列表 if 条件] */
    var mcl = s.match(/^\[\s*([\s\S]+?)\s+for\s+(\w+)\s+in\s+([\s\S]+?)(?:\s+if\s+([\s\S]+?))?\s*\]$/);
    if (mcl) {
      var bodyExpr = mcl[1], loopVar = mcl[2], iterExpr = mcl[3], condExpr = mcl[4];
      var t = "从 " + zhExpr(iterExpr) + " 里";
      if (condExpr) t += "挑出满足「" + zhCond(condExpr) + "」的";
      t += "每一项，收集成一个新列表";
      if (bodyExpr.trim() !== loopVar) t += "（每一项取 " + zhExpr(bodyExpr) + "）";
      return t;
    }

    /* f-string */
    var mf = s.match(/^f(["'])([\s\S]*)\1$/);
    if (mf) {
      var slots = mf[2].match(/\{[^}]+\}/g) || [];
      var names = slots.map(function (t) {
        var inner = t.replace(/[{}]/g, "").split(":")[0].trim();
        return zhIdent(inner);
      });
      return "一段拼好的文本（把 " + (names.join("、") || "变量") + " 的值填进去）";
    }

    /* 列表 / 字典字面量 */
    if (/^\[[\s\S]*\]$/.test(s)) {
      var inner = s.slice(1, -1).trim();
      if (!inner) return "空列表";
      var parts = splitTop(inner, ",");
      var zs = parts.map(function (p) { return zhExpr(p); });
      return "列表 [" + zs.join("、") + "]";
    }
    if (/^\{[\s\S]*\}$/.test(s)) {
      if (!s.slice(1, -1).trim()) return "空字典";
      return "字典 {" + s.slice(1, -1).trim() + "}";
    }

    /* 方法调用：text.strip() / cart.append("egg") */
    var mm = s.match(/^([A-Za-z_][\w.]*)\.([A-Za-z_]\w*)\s*\(([\s\S]*)\)$/);
    if (mm) {
      var obj = zhPath(mm[1]), meth = mm[2], margs = mm[3].trim();
      var argz = margs ? splitTop(margs, ",").map(function (a) { return zhExpr(a); }).join("、") : "";
      if (meth === "strip") return obj + " 去掉首尾空格";
      if (meth === "lower") return obj + " 转成小写";
      if (meth === "upper") return obj + " 转成大写";
      if (meth === "split") return obj + " 按 " + (argz || "空格") + " 切分成一个列表";
      if (meth === "join") return "用 " + obj + " 把 " + (argz || "列表里的每一项") + " 连成一个字符串";
      if (meth === "replace") {
        var rp = splitTop(margs, ",").map(function (a) { return zhExpr(a); });
        return "把 " + obj + " 里的 " + (rp[0] || "旧内容") + " 换成 " + (rp[1] || "新内容");
      }
      if (meth === "append") return "往 " + obj + " 末尾加一个 " + argz;
      if (meth === "get") return "从 " + obj + " 里按键取值" + (argz ? "（键：" + argz + "）" : "");
      if (meth === "keys") return obj + " 里所有的键";
      if (meth === "values") return obj + " 里所有的值";
      if (meth === "items") return obj + " 里所有的键值对";
      if (meth === "count") return obj + " 里 " + argz + " 出现的次数";
      if (meth === "format") return "把 " + argz + " 填进 " + obj + " 的占位符里";
      var mz = API[meth] || zhName(meth);
      return obj + " 的 " + (mz || meth) + (argz ? "（" + argz + "）" : "");
    }

    /* 函数调用：name(args) */
    var mc = s.match(/^([A-Za-z_]\w*)\s*\(([\s\S]*)\)$/);
    if (mc) {
      var fn = mc[1], args = mc[2].trim();
      var az = args ? splitTop(args, ",").map(function (a) { return zhExpr(a); }).join("、") : "";
      /* 几个高频函数说人话 */
      if (fn === "len") return az + " 的长度（有几个）";
      if (fn === "sum") return az + " 里所有数的总和";
      if (fn === "int") return az + " 转成整数";
      if (fn === "str") return az + " 转成文本";
      if (fn === "float") return az + " 转成小数";
      if (fn === "bool") return az + " 转成真假值";
      if (fn === "range") {
        var ra = args.split(",").map(function (x) { return x.trim(); });
        if (ra.length === 1) return "从 0 到 " + (Number(ra[0]) - 1) + " 的一串数字";
        if (ra.length === 2) return "从 " + ra[0] + " 到 " + (Number(ra[1]) - 1) + " 的一串数字";
        return "从 " + ra[0] + " 到 " + (Number(ra[1]) - 1) + "、每次加 " + ra[2] + " 的数字";
      }
      if (fn === "print") return "打印 " + az;
      /* 类名（首字母大写）不硬翻，保留原名 */
      if (/^[A-Z]/.test(fn)) return fn + "（" + az + "）";
      var fnZh = API[fn] || zhName(fn);
      if (fnZh) return fnZh + "（" + az + "）";
      return fn + "（" + az + "）";
    }

    /* 下标取值：a[0] / a["name"] */
    var mi = s.match(/^([A-Za-z_]\w*)\s*\[\s*([^\]]+)\s*\]$/);
    if (mi) {
      var idx = mi[2].trim(), pos;
      if (/^\d+$/.test(idx)) {
        pos = "第 " + (Number(idx) + 1) + " 项的值";
      } else if (/^["'].*["']$/.test(idx)) {
        var kz = zhName(idx.slice(1, -1));
        pos = (kz ? kz + "（" + idx + "）" : idx) + " 这一项的值";
      } else {
        pos = zhExpr(idx) + " 对应的那一项的值";
      }
      return zhIdent(mi[1]) + " 里 " + pos;
    }

    /* 属性：a.b */
    var mp = s.match(/^([A-Za-z_]\w*)\.([A-Za-z_]\w*)$/);
    if (mp) return zhIdent(mp[1]) + " 的 " + (API[mp[2]] || zhName(mp[2]) || mp[2]);

    /* 普通表达式：运算符替换 + 标识符翻译 */
    var t = s;
    OPS.forEach(function (pair) { t = t.split(pair[0]).join(pair[1]); });
    t = t.replace(/[A-Za-z_]\w*/g, function (w) { return zhIdent(w); });
    return t.replace(/\s{2,}/g, " ").trim();
  }

  /* 按顶层分隔符切开（忽略括号/引号里的） */
  function splitTop(s, sep) {
    var out = [], depth = 0, q = null, buf = "";
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (q) { buf += c; if (c === q && s[i - 1] !== "\\") q = null; continue; }
      if (c === '"' || c === "'") { q = c; buf += c; continue; }
      if ("([{".indexOf(c) > -1) depth++;
      if (")]}".indexOf(c) > -1) depth--;
      if (c === sep && depth === 0) { out.push(buf.trim()); buf = ""; continue; }
      buf += c;
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
  }

  function zhCond(c) {
    var s = String(c || "").trim();
    if (s === "True") return "一直成立";
    if (s === "False") return "永远不成立";
    s = s.replace(/\band\b/g, " 并且 ").replace(/\bor\b/g, " 或者 ");
    s = s.replace(/^not\s+/, "不满足 ");
    OPS.forEach(function (pair) { if (pair[0] !== "+" && pair[0] !== "-" && pair[0] !== "*" && pair[0] !== "/") s = s.split(pair[0]).join(pair[1]); });
    s = s.replace(/[A-Za-z_]\w*/g, function (w) { return zhIdent(w); });
    return s.replace(/\s{2,}/g, " ").trim();
  }

  /* ---------------- 单行代码 → 中文 ---------------- */
  function zhLine(raw) {
    var indent = raw.match(/^[ \t]*/)[0].length;
    var parts = splitComment(raw);
    var s = parts.body.trim();
    if (!s) {
      if (parts.comment) return { src: raw.trim(), zh: "注释：" + parts.comment, indent: indent, kind: "comment" };
      return null;
    }
    var out = null, m;

    /* 注释行 */
    if (/^#/.test(s)) {
      return { src: s, zh: "注释：" + s.replace(/^#+\s*/, ""), indent: indent, kind: "comment" };
    }

    /* for ... in range(...) */
    if ((m = s.match(/^for\s+(\w+)\s+in\s+range\s*\(([^)]*)\)\s*:$/))) {
      var ra = m[2].split(",").map(function (x) { return x.trim(); });
      var rng = ra.length === 1 ? ("0 到 " + (Number(ra[0]) - 1)) :
                ("从 " + ra[0] + " 到 " + (Number(ra[1]) - 1) + (ra[2] ? "（每次加 " + ra[2] + "）" : ""));
      out = "让 " + m[1] + (zhName(m[1]) ? "（" + zhName(m[1]) + "）" : "") + " 依次取 " + rng + " 里的每个数，每取一次就执行下面缩进的代码";
    }
    /* for ... in 其他 */
    else if ((m = s.match(/^for\s+(\w+)\s+in\s+(.+?)\s*:$/))) {
      out = "依次从 " + zhExpr(m[2]) + " 里取出每一项，叫它 " + m[1] +
            (zhName(m[1]) ? "（" + zhName(m[1]) + "）" : "") + "，每取一次执行下面缩进的代码";
    }
    /* while */
    else if ((m = s.match(/^while\s+(.+?)\s*:$/))) {
      out = (m[1].trim() === "True")
        ? "无限循环：一直重复执行下面缩进的代码（里面必须写退出条件，否则停不下来）"
        : ("只要「" + zhCond(m[1]) + "」成立，就一直重复执行下面缩进的代码");
    }
    /* if / elif / else */
    else if ((m = s.match(/^if\s+(.+?)\s*:$/))) {
      out = "如果「" + zhCond(m[1]) + "」成立，就执行下面缩进的代码";
    }
    else if ((m = s.match(/^elif\s+(.+?)\s*:$/))) {
      out = "否则，如果「" + zhCond(m[1]) + "」成立，就执行这一段";
    }
    else if (/^else\s*:$/.test(s)) {
      out = "否则（上面的条件都不成立）就执行这一段";
    }
    /* def */
    else if ((m = s.match(/^def\s+(\w+)\s*\(([^)]*)\)\s*:$/))) {
      var params = m[2].trim();
      var pz = params ? splitTop(params, ",").map(function (p) {
        var pn = p.split("=")[0].trim();
        return pn + (zhName(pn) ? "（" + zhName(pn) + "）" : "") + (p.indexOf("=") > -1 ? "，不传时用 " + p.split("=")[1].trim() : "");
      }).join("、") : "不用参数";
      var fname = m[1];
      var head = /^__\w+__$/.test(fname)
        ? ("定义一个特殊方法 " + fname + (fname === "__init__" ? "（创建对象时自动执行，用来设初始值）" : ""))
        : ("定义函数 " + fname + (zhName(fname) ? "（" + zhName(fname) + "）" : ""));
      out = head + "，需要传入：" + pz + "；下面缩进的就是它的步骤";
    }
    /* class */
    else if ((m = s.match(/^class\s+(\w+)\s*(?:\(\s*(\w+)\s*\))?\s*:$/))) {
      out = "定义一个类 " + m[1] + (zhName(m[1]) ? "（" + zhName(m[1]) + "）" : "") +
            (m[2] ? "，继承自 " + m[2] : "") + "，下面缩进的是它的构造和功能";
    }
    /* return */
    else if ((m = s.match(/^return\b\s*(.*)$/))) {
      out = m[1] ? ("把 " + zhExpr(m[1]) + " 交回给调用它的地方") : "结束这个函数，什么都不返回";
    }
    /* print */
    else if ((m = s.match(/^print\s*\(([\s\S]*)\)$/))) {
      var pArgs = splitTop(m[1], ",").map(function (a) { return zhExpr(a); }).join("、");
      out = "把 " + pArgs + " 显示到屏幕上";
    }
    /* append 之类的方法调用 */
    else if ((m = s.match(/^([\w.]+)\.(append|remove|pop|insert|sort|reverse|clear)\(([\s\S]*)\)$/))) {
      var verb = {
        append: "末尾加一个", remove: "里删掉", pop: "里取出并删掉",
        insert: "里插入", sort: "里的内容就地从小到大排好序",
        reverse: "里的顺序反过来", clear: "清空"
      }[m[2]];
      var arg = m[3].trim() ? " " + zhExpr(m[3]) : "";
      out = (m[2] === "sort" || m[2] === "reverse" || m[2] === "clear")
        ? ("把 " + zhIdent(m[1]) + verb + arg)
        : ("往 " + zhIdent(m[1]) + " " + verb + arg + "（就地改动，不生成新列表）");
    }
    /* 累加 */
    else if ((m = s.match(/^(\w+)\s*\+=\s*([\s\S]+)$/))) {
      out = zhIdent(m[1]) + " 增加 " + zhExpr(m[2]) + "（在原值基础上累加）";
    }
    /* assert */
    else if ((m = s.match(/^assert\s+([\s\S]+)$/))) {
      out = "检查「" + zhCond(m[1]) + "」，不成立就立刻报错停下（用来验证结果对不对）";
    }
    /* try / except */
    else if (/^try\s*:$/.test(s)) {
      out = "下面这段可能出错，放进 try 里试着执行";
    }
    else if ((m = s.match(/^except\s*(\w*)\s*(?:as\s+(\w+))?\s*:$/))) {
      out = "如果执行中出现 " + (m[1] || "任何错误") + "，就执行这一段（不会让程序崩掉）";
    }
    else if (/^finally\s*:$/.test(s)) {
      out = "不管上面成功还是出错，这一段的代码都会执行";
    }
    /* with open */
    else if ((m = s.match(/^with\s+open\s*\(([^)]*)\)\s+as\s+(\w+)\s*:$/))) {
      out = "打开文件 " + zhExpr(splitTop(m[1], ",")[0]) + "，用 " + m[2] + " 代表它，用完自动关闭";
    }
    /* import */
    else if ((m = s.match(/^import\s+([\w.]+)(?:\s+as\s+(\w+))?$/))) {
      out = "引入 " + m[1] + " 这个模块" + (m[2] ? "，在这里叫 " + m[2] : "");
    }
    else if ((m = s.match(/^from\s+([\w.]+)\s+import\s+(.+)$/))) {
      out = "从 " + m[1] + " 里拿出 " + m[2] + " 来用";
    }
    /* 下标赋值 */
    else if ((m = s.match(/^([\w.]+)\s*\[([^\]]+)\]\s*=\s*([\s\S]+)$/))) {
      var idx2 = m[2].trim(), pos2;
      if (/^\d+$/.test(idx2)) pos2 = "第 " + (Number(idx2) + 1) + " 项";
      else if (/^["'].*["']$/.test(idx2)) {
        var kz2 = zhName(idx2.slice(1, -1));
        pos2 = (kz2 ? kz2 + "（" + idx2 + "）" : idx2) + " 这一项";
      } else pos2 = zhExpr(idx2) + " 对应的那一项";
      out = "把 " + zhPath(m[1]) + " 里 " + pos2 + " 换成 " + zhExpr(m[3]);
    }
    /* 普通赋值（含 self.name 这种属性赋值） */
    else if ((m = s.match(/^([A-Za-z_][\w.]*)\s*=\s*([\s\S]+)$/))) {
      var lhs = m[1];
      var disp;
      if (lhs.indexOf(".") > -1) disp = "（" + zhPath(lhs) + "）";
      else if (zhName(lhs)) disp = "（" + zhName(lhs) + "）";
      else disp = "（新变量）";
      out = "把 " + zhExpr(m[2]) + " 存进 " + lhs + disp;
    }
    /* 兜底：表达式 */
    else {
      out = "执行：" + zhExpr(s);
    }

    if (indent > 0) out = "　".repeat(Math.min(3, Math.round(indent / 4))) + out;
    return { src: raw.trim(), zh: out, indent: indent, kind: "code", comment: parts.comment };
  }

  /* 英文句子查词：带简单词形还原（stops → stop、trying → try） */
  function lookupWord(w) {
    var low = String(w).toLowerCase();
    if (WORDS[low]) return WORDS[low];
    if (API[low]) return API[low];
    var tries = [
      low.replace(/ies$/, "y"), low.replace(/es$/, ""), low.replace(/s$/, ""),
      low.replace(/ing$/, ""), low.replace(/ing$/, "e"),
      low.replace(/ed$/, ""), low.replace(/ed$/, "e")
    ];
    for (var i = 0; i < tries.length; i++) {
      var t = tries[i];
      if (t !== low && t.length > 2) {
        if (WORDS[t]) return WORDS[t];
        if (API[t]) return API[t];
      }
    }
    return null;
  }

  /* ---------------- 英文句子：只标注认识的术语 ---------------- */
  function zhSentence(text) {
    var words = String(text).match(/[A-Za-z][A-Za-z'-]*/g) || [];
    if (!words.length) return [];
    var seen = {}, out = [];
    words.forEach(function (w) {
      var low = w.toLowerCase();
      if (STOP[low] || seen[low]) return;
      var z = lookupWord(w);
      if (!z) return;
      seen[low] = 1;
      out.push({ w: w, zh: z });
    });
    return out;
  }

  /* ---------------- 主入口 ---------------- */
  function translate(text) {
    var raw = String(text || "").replace(/\r/g, "");
    if (!raw.trim()) return { kind: "empty", lines: [], words: [], note: "" };

    var lines = raw.split("\n").filter(function (l) { return l.trim(); });
    var codeScore = 0;
    lines.forEach(function (l) {
      if (/[=(){}[\]:]|^\s*(print|def|for|if|while|return|import|class)\b/.test(l)) codeScore++;
    });

    /* 单个标识符 */
    if (lines.length === 1 && /^[A-Za-z_]\w*$/.test(raw.trim())) {
      var one = raw.trim();
      var z1 = zhName(one) || API[one] || null;
      if (z1) return { kind: "name", lines: [{ src: one, zh: z1 }], words: [], note: "本地词表命中。" };
      return { kind: "name", lines: [{ src: one, zh: "词表里没有这个词" }], words: [], note: "可以选择「问 AI」让它解释。" };
    }

    /* 像代码：逐行翻 */
    if (codeScore > 0) {
      var out = [];
      lines.forEach(function (l) {
        var r = zhLine(l);
        if (r) out.push(r);
      });
      return { kind: "code", lines: out, words: [], note: "本地规则翻译，逐行对照。" };
    }

    /* 英文句子：术语标注 */
    var ws = zhSentence(raw);
    return {
      kind: "sentence",
      lines: [],
      words: ws,
      note: ws.length
        ? "这是英文句子，本地只标出认得的术语；整句通顺翻译需要 AI。"
        : "这句里没有本地认得的技术词，可以点「问 AI」问它。"
    };
  }

  window.PyGloss = { translate: translate, zhName: zhName, zhExpr: zhExpr, zhLine: zhLine };
})();
