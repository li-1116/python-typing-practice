/* =========================================================
   chapters-extra.js
   把讲义《Python 一篇概全》里「补充」层的内容补齐到练习站：
   1) CHAPTER_EXTRAS —— 现有 12 章各补折叠式「补充细节」
   2) MORE_CHAPTERS  —— 讲义 08 / 13 / 14 / 15 / 16 / 17 扩成第 13-18 章
   主文件 index.html 只负责渲染，内容都在这里，方便以后增删。
   ========================================================= */

window.CHAPTER_EXTRAS = {

/* ---------- 第 1 章 ---------- */
1: [
  {
    h: "先看全貌：一个程序由什么组成（讲义 01）",
    html: `
      <p>完整程序通常包含四层，读任何代码都先找它们：<b>用数据描述对象</b>、<b>用条件表达规则</b>、<b>用循环批量执行</b>、<b>用函数封装任务</b>。</p>
      <table class="mini">
        <thead><tr><th>运行方式</th><th>特点</th><th>常见坑</th></tr></thead>
        <tbody>
          <tr><td>脚本文件 <code class="inline">python lesson.py</code></td><td>从上到下依次执行</td><td>部分电脑命令是 <code class="inline">python3</code></td></tr>
          <tr><td>交互式解释器</td><td>输入一行执行一行</td><td>变量只在当前会话有效</td></tr>
          <tr><td>Notebook</td><td>按单元执行，可反复跑</td><td>执行顺序会影响变量状态，必要时重启重跑</td></tr>
        </tbody>
      </table>
      <ul>
        <li>编辑器负责编辑，解释器负责执行——编辑器装好了不代表环境配好了。</li>
        <li>Python 用<b>缩进</b>表示代码块，通常每层 4 个空格，不混用 Tab 与空格；行尾英文冒号 <code class="inline">:</code> 表示代码块即将开始。</li>
        <li><code class="inline">#</code> 是单行注释；三引号是<b>多行字符串</b>，放在函数开头时充当说明文档，不是专门的注释语法。</li>
        <li><code class="inline">()</code> 用于调用和分组，<code class="inline">[]</code> 用于列表和索引，<code class="inline">{}</code> 用于字典和集合——同一个符号在不同位置含义不同。</li>
      </ul>`
  }
],

/* ---------- 第 2 章 ---------- */
2: [
  {
    h: "类型表与 input()：讲义 02 的细节",
    html: `
      <table class="mini">
        <thead><tr><th>类型</th><th>用途</th><th>示例</th><th>常见误区</th></tr></thead>
        <tbody>
          <tr><td><code class="inline">int</code></td><td>个数、整数计算</td><td><code class="inline">42</code> <code class="inline">-3</code></td><td>除法 <code class="inline">/</code> 的结果通常不是整数</td></tr>
          <tr><td><code class="inline">float</code></td><td>小数计算</td><td><code class="inline">3.14</code></td><td>二进制浮点不能精确表示所有小数</td></tr>
          <tr><td><code class="inline">str</code></td><td>文本</td><td><code class="inline">"85"</code></td><td>数字字符串不等于数字</td></tr>
          <tr><td><code class="inline">bool</code></td><td>真 / 假</td><td><code class="inline">True</code></td><td>大小写必须正确</td></tr>
          <tr><td><code class="inline">NoneType</code></td><td>缺失、尚无结果</td><td><code class="inline">None</code></td><td><code class="inline">None</code> 不等于 0 或空字符串</td></tr>
        </tbody>
      </table>
      <p><b>从键盘拿输入：</b><code class="inline">input()</code> 的返回值永远是<b>字符串</b>，要算数必须先转换：</p>
      <pre class="codeblock">age = input("你几岁：")      # 输入 18，得到的是字符串 "18"
age = int(age)               # 转成整数才能做运算
print(age + 1)</pre>
      <ul>
        <li><code class="inline">int("85")</code> 可以，<code class="inline">int("85.5")</code> 会报错；<code class="inline">int(85.9)</code> 是<b>截断</b>成 85，不是四舍五入。</li>
        <li><code class="inline">bool("")</code> 是 <code class="inline">False</code>，但 <code class="inline">bool("False")</code> 是 <code class="inline">True</code>——非空字符串就是真。</li>
        <li>判断缺失用 <code class="inline">value is None</code>，不要用 <code class="inline">==</code>。</li>
        <li><code class="inline">0.1 + 0.2 == 0.3</code> 通常是 <code class="inline">False</code>；近似比较用 <code class="inline">math.isclose()</code>，涉及金额再学 <code class="inline">decimal.Decimal</code>。</li>
        <li>变量名区分大小写，不能以数字开头，也别覆盖 <code class="inline">list</code>、<code class="inline">sum</code>、<code class="inline">str</code> 这些内置名字。</li>
      </ul>
      <p class="ex-note">说明：<code class="inline">input()</code> 需要键盘输入，页内运行器不方便交互，本章示例尽量用直接赋值；在自己的终端里可以把赋值换成 input() 试一次。</p>`
  }
],

/* ---------- 第 3 章 ---------- */
3: [
  {
    h: "条件的三条补充（讲义 05）",
    html: `
      <ul>
        <li><b>独立 if 与互斥 elif 不是一回事：</b>多个独立 <code class="inline">if</code> 可能全部执行；一组 <code class="inline">if / elif / else</code> 最多执行一个分支。</li>
        <li><b>条件表达式</b>适合简短二选一：<code class="inline">label = "及格" if score &gt;= 60 else "待提高"</code>。</li>
        <li><code class="inline">if score:</code> 判断的是分数的真假，<b>不是</b>是否及格——它会把 0 分和"没有分数"混为一谈。</li>
        <li><code class="inline">pass</code> 是空操作占位符，表示"这里先什么都不做"，不代表退出或跳过。</li>
        <li>嵌套条件能表达复杂规则，但超过两三层就该拆成函数。</li>
        <li>边界要专门想：<code class="inline">&gt;= 60</code> 与 <code class="inline">&gt; 60</code> 差一分，结果完全不同。</li>
      </ul>`
  }
],

/* ---------- 第 4 章 ---------- */
4: [
  {
    h: "四种容器一览（讲义 04）",
    html: `
      <table class="mini">
        <thead><tr><th>容器</th><th>示例</th><th>顺序与修改</th><th>适用场景</th></tr></thead>
        <tbody>
          <tr><td>列表 <code class="inline">list</code></td><td><code class="inline">[85, 58]</code></td><td>有序、可修改、允许重复</td><td>多条记录、可变序列</td></tr>
          <tr><td>元组 <code class="inline">tuple</code></td><td><code class="inline">(120, 30)</code></td><td>有序、元素不能重新赋值</td><td>坐标、固定组合</td></tr>
          <tr><td>字典 <code class="inline">dict</code></td><td><code class="inline">{"name": "小林"}</code></td><td>保留插入顺序、键唯一、可修改</td><td>属性、查找、映射</td></tr>
          <tr><td>集合 <code class="inline">set</code></td><td><code class="inline">{"一班", "二班"}</code></td><td>不承诺顺序、元素唯一</td><td>去重、交集、成员判断</td></tr>
        </tbody>
      </table>
      <pre class="codeblock">nums = [85, 58, 92, 58]
print(set(nums))                 # 去重，顺序不保证
print(len(set(nums)))            # 3

a = {"一班", "二班"}
b = {"二班", "三班"}
print(a & b)                     # 交集：{'二班'}</pre>
      <ul>
        <li><code class="inline">[]</code> 是空列表，<code class="inline">{}</code> 是空<b>字典</b>，空集合要写 <code class="inline">set()</code>，单元素元组要写 <code class="inline">(1,)</code>。</li>
        <li><b>赋值不等于复制：</b><code class="inline">b = a</code> 只是给同一份数据起了第二个名字，改 b 会影响 a。要独立副本用 <code class="inline">a.copy()</code>（浅复制），嵌套结构需要 <code class="inline">copy.deepcopy()</code>。</li>
        <li><code class="inline">del d[key]</code> 按键删除；<code class="inline">list.remove(值)</code> 删第一个匹配项，目标不存在会报错。</li>
      </ul>`
  }
],

/* ---------- 第 5 章 ---------- */
5: [
  {
    h: "循环工具箱：range / zip / 推导式（讲义 06）",
    html: `
      <ul>
        <li><code class="inline">range(start, stop, step)</code> <b>不包含 stop</b>，步长不能为 0；<code class="inline">range(3)</code> 是 0、1、2。</li>
        <li><code class="inline">zip()</code> 把两个列表配对，默认以<b>最短</b>的为准，长度不一致会悄悄丢数据。</li>
        <li><code class="inline">break</code> 结束整个循环；<code class="inline">continue</code> 跳过本轮剩下的语句，直接进入下一轮。</li>
        <li>遍历列表时直接删元素会漏处理记录——正确做法是构造一个新列表。</li>
        <li><code class="inline">while</code> 必须有明确的停止机制，否则会死循环。</li>
      </ul>
      <p><b>推导式</b>把"遍历 + 筛选 + 生成"压成一行，复杂逻辑还是写普通循环：</p>
      <pre class="codeblock">scores = [85, 58, 92, 40]

passed = [s for s in scores if s &gt;= 60]      # 筛选
labels = ["及格" if s &gt;= 60 else "待提高" for s in scores]

print(passed)                                  # [85, 92]
print(sum(scores) / len(scores))               # 68.75</pre>
      <p><b>聚合陷阱：</b>空列表不能直接 <code class="inline">sum(x) / len(x)</code>（除以 0 会报错），<code class="inline">min([])</code> 和 <code class="inline">max([])</code> 同样会报错。</p>`
  }
],

/* ---------- 第 6 章 ---------- */
6: [
  {
    h: "参数与返回值：讲义 07 的细节",
    html: `
      <ul>
        <li><b>print 与 return 分工不同：</b>print 把内容显示在屏幕上；return 把结果交回调用者。只打印不返回的函数，调用结果是 <code class="inline">None</code>。</li>
        <li><code class="inline">return a, b</code> 实际返回一个<b>元组</b>，可以 <code class="inline">x, y = f()</code> 解包。</li>
        <li>函数内部赋值的名字通常是局部变量；优先"参数传入、返回值交出"，少依赖全局变量。</li>
        <li><b>默认参数别用可变对象：</b><code class="inline">def f(x, bag=[])</code> 的这个列表会被所有调用共享，越用越长。默认值写 <code class="inline">None</code>，函数内再 <code class="inline">if bag is None: bag = []</code>。</li>
        <li><code class="inline">*args</code> 收多余的位置参数，<code class="inline">**kwargs</code> 收多余的关键字参数——第一遍能认出即可。</li>
        <li><b>类型提示</b>只表达约定，运行时不自动检查：<code class="inline">def f(score: int) -&gt; str:</code>，传错类型照样能跑。</li>
      </ul>
      <pre class="codeblock">def add(a: int, b: int = 10) -&gt; int:
    return a + b

print(add(5))         # 15：默认参数生效
print(add(5, 2))      # 7：按位置传参
print(add(b=2, a=5))  # 7：按关键字传参</pre>
      <pre class="codeblock">students = [{"name": "小林", "score": 85}, {"name": "小陈", "score": 58}]
by_score = sorted(students, key=lambda s: s["score"])
print(by_score[0]["name"])    # 小陈</pre>
      <p class="ex-note">lambda 是临时用一次的短函数，<code class="inline">lambda s: s["score"]</code> 等价于一个只 return 分数的小函数。</p>`
  }
],

/* ---------- 第 7 章 ---------- */
7: [
  {
    h: "运算符优先级与字符串细节（讲义 03）",
    html: `
      <table class="mini">
        <thead><tr><th>类别</th><th>符号</th><th>含义</th></tr></thead>
        <tbody>
          <tr><td>算术</td><td><code class="inline">+ - * /</code></td><td>加、减、乘、除（/ 结果是 float）</td></tr>
          <tr><td>算术</td><td><code class="inline">// % **</code></td><td>向下取整除法、余数、幂</td></tr>
          <tr><td>比较</td><td><code class="inline">== != &gt; &gt;= &lt; &lt;=</code></td><td>得到布尔值</td></tr>
          <tr><td>逻辑</td><td><code class="inline">and or not</code></td><td>与、或、非（会短路）</td></tr>
          <tr><td>成员</td><td><code class="inline">in</code> / <code class="inline">not in</code></td><td>是否属于某个容器</td></tr>
          <tr><td>身份</td><td><code class="inline">is</code> / <code class="inline">is not</code></td><td>是否同一个对象（判断 None 用它）</td></tr>
          <tr><td>更新</td><td><code class="inline">+= -= *=</code></td><td>累计更新写法</td></tr>
        </tbody>
      </table>
      <ul>
        <li><b>字符串不可变：</b><code class="inline">s.strip()</code>、<code class="inline">s.replace()</code> 都返回<b>新</b>字符串，不赋值就丢结果。</li>
        <li>切片 <code class="inline">[起点:终点:步长]</code> 不含终点；索引越界会报错，切片通常会自动截到有效范围。</li>
        <li><code class="inline">\n</code> 换行，<code class="inline">\t</code> 制表符；<code class="inline">r"a\nb"</code> 是原始字符串，反斜杠保留原样。</li>
        <li>比较内容用 <code class="inline">==</code>，别用 <code class="inline">is</code> 比分数或字符串。</li>
        <li>优先级不确定就加括号：<code class="inline">-3 // 2</code> 是 <code class="inline">-2</code>（向负无穷取整）。</li>
        <li><code class="inline">and</code> / <code class="inline">or</code> 会短路，还可能返回操作数本身——入门先用来组合明确的条件。</li>
      </ul>
      <pre class="codeblock">raw = " 85分 "
num = int(raw.strip().replace("分", ""))
print(num, type(num).__name__)    # 85 int

print(f"{num / 3:.1f}")           # 28.3：保留一位小数</pre>`
  }
],

/* ---------- 第 8 章 ---------- */
8: [
  {
    h: "字典与元组的坑（讲义 04）",
    html: `
      <ul>
        <li><b>缺失键：</b><code class="inline">d["missing"]</code> 抛 <code class="inline">KeyError</code>；<code class="inline">d.get("missing")</code> 返回 <code class="inline">None</code>，<code class="inline">d.get(k, 0)</code> 给默认值。但不要用默认值掩盖"必须存在"的字段。</li>
        <li>键和集合元素必须可哈希：字符串、数字可以，列表和字典不行。</li>
        <li><b>元组不可变 ≠ 内部都不可变：</b>元组里的列表照样能改。</li>
        <li>选结构看需求：一条记录用字典（<code class="inline">{"name": ..., "score": ...}</code>），多条记录用列表装字典，固定组合（坐标、宽高）用元组。</li>
        <li>用 <code class="inline">in</code> 判断键是否存在：<code class="inline">if "score" in student:</code></li>
      </ul>
      <pre class="codeblock">student = {"name": "小林", "score": 85}

print(student.get("class", "未填"))   # 未填
print("score" in student)             # True

del student["score"]                  # 按键删除
print(student)                        # {'name': '小林'}</pre>`
  }
],

/* ---------- 第 9 章 ---------- */
9: [
  {
    h: "异常全景：类型、raise 与 finally（讲义 11）",
    html: `
      <table class="mini">
        <thead><tr><th>异常</th><th>什么时候出现</th></tr></thead>
        <tbody>
          <tr><td><code class="inline">NameError</code></td><td>用了没定义的名字（含拼写错误）</td></tr>
          <tr><td><code class="inline">TypeError</code></td><td>类型不匹配，如 <code class="inline">"a" + 1</code></td></tr>
          <tr><td><code class="inline">ValueError</code></td><td>值不合要求，如 <code class="inline">int("abc")</code></td></tr>
          <tr><td><code class="inline">IndexError</code></td><td>索引越界</td></tr>
          <tr><td><code class="inline">KeyError</code></td><td>字典里没有这个键</td></tr>
          <tr><td><code class="inline">FileNotFoundError</code></td><td>文件路径不对或文件不存在</td></tr>
        </tbody>
      </table>
      <ul>
        <li><b>读 Traceback 的顺序：</b>先看最后一行（异常类型 + 消息），再往上找自己代码的文件名和行号。</li>
        <li><code class="inline">raise</code> 主动抛出异常，适合"数据不合格就当场拒绝"。</li>
        <li><code class="inline">else</code> 在没有异常时执行，<code class="inline">finally</code> 无论成败都执行（清理现场用）。</li>
        <li><b>别用宽泛捕获 + pass 掩盖问题：</b><code class="inline">except:</code> 吞掉一切错误，程序看着能跑，其实数据已经错了。</li>
        <li>调试从打印 <code class="inline">repr(value)</code> 和 <code class="inline">type(value)</code> 开始。</li>
        <li><code class="inline">float("nan")</code>、<code class="inline">float("inf")</code> 都能转换成功，所以"能转成数字"不等于"是合法分数"——校验要再加范围与有限性判断。</li>
      </ul>
      <pre class="codeblock">def parse_score(text):
    num = float(text)
    if not (0 &lt;= num &lt;= 100):          # nan 比较恒为 False，也会被拦下
        raise ValueError("分数必须在 0～100")
    return num

try:
    print(parse_score("85"))
    print(parse_score("120"))
except ValueError as e:
    print("拒绝：", e)                  # 拒绝：分数必须在 0～100
finally:
    print("校验结束")</pre>`
  }
],

/* ---------- 第 10 章 ---------- */
10: [
  {
    h: "路径、编码与 CSV / JSON（讲义 10）",
    html: `
      <table class="mini">
        <thead><tr><th>模式</th><th>含义</th></tr></thead>
        <tbody>
          <tr><td><code class="inline">"r"</code></td><td>读取（默认），文件不存在会报错</td></tr>
          <tr><td><code class="inline">"w"</code></td><td>写入，<b>清空原内容</b>再写</td></tr>
          <tr><td><code class="inline">"a"</code></td><td>追加，原内容保留</td></tr>
          <tr><td><code class="inline">"rb" / "wb"</code></td><td>二进制读写（图片、压缩包）</td></tr>
        </tbody>
      </table>
      <ul>
        <li><b>相对路径相对于"当前工作目录"，不是相对于代码文件。</b>脚本里用 <code class="inline">Path(__file__).resolve().parent</code> 定位脚本所在目录；Notebook 通常没有 <code class="inline">__file__</code>。</li>
        <li><code class="inline">with open(...) as f:</code> 会自动关闭文件，别手写 close。</li>
        <li>读写文本建议显式写 <code class="inline">encoding="utf-8"</code>，避免 Windows 默认编码踩坑。</li>
        <li>写文件前先确认路径和作用范围；练习用副本和专用输出目录，别覆盖原始数据。</li>
      </ul>
      <p><b>CSV 适合二维表格，JSON 适合嵌套结构：</b></p>
      <pre class="codeblock">import csv, json

rows = [["name", "score"], ["小林", "85"], ["小陈", "58"]]
with open("scores.csv", "w", encoding="utf-8", newline="") as f:
    csv.writer(f).writerows(rows)

with open("scores.csv", encoding="utf-8") as f:
    for row in csv.reader(f):
        print(row)                 # ['name', 'score'] / ['小林', '85'] ...

data = {"name": "小林", "passed": True, "note": None}
text = json.dumps(data, ensure_ascii=False)
print(text)                        # {"name": "小林", "passed": true, "note": null}
print(json.loads(text)["passed"])   # True</pre>
      <p class="ex-note">注意 JSON 的对象键永远是字符串，<code class="inline">true / false / null</code> 对应 Python 的 <code class="inline">True / False / None</code>；<code class="inline">dumps / loads</code> 处理字符串，<code class="inline">dump / load</code> 面向文件对象。CSV 内容不能粗暴按逗号拆——字段内部可能有逗号，要用 <code class="inline">csv</code> 模块。</p>`
  }
],

/* ---------- 第 11 章 ---------- */
11: [
  {
    h: "环境与包：venv / pip / __main__（讲义 09）",
    html: `
      <p>下面是<b>终端命令，不是 Python 语句</b>（假设本机命令是 <code class="inline">python</code>）：</p>
      <pre class="codeblock">python --version
python -m venv .venv

# macOS / Linux 激活
source .venv/bin/activate
# Windows PowerShell 激活
.venv\\Scripts\\Activate.ps1

python -m pip install pandas openpyxl
python -m pip show pandas
python -m pip freeze &gt; requirements.txt
python -m pip install -r requirements.txt</pre>
      <ul>
        <li>模块就是一个 <code class="inline">.py</code> 文件；包组织多个模块；库是一组可复用能力的通称。</li>
        <li>标准库随 Python 自带；第三方库要<b>安装</b>。import 只负责"拿来用"，不负责下载。</li>
        <li>分发包名和导入名有时不同（装 <code class="inline">pillow</code>，导入 <code class="inline">PIL</code>）。</li>
        <li>虚拟环境隔离项目依赖；编辑器选的解释器要和装依赖的是<b>同一个</b>。</li>
        <li>别把自己的文件命名成 <code class="inline">json.py</code>、<code class="inline">csv.py</code>，会遮蔽真正要导入的模块。</li>
        <li><code class="inline">if __name__ == "__main__":</code> 下的代码只在"直接运行这个文件"时执行，被 import 时不会跑——适合放程序入口。</li>
      </ul>
      <p class="ex-note">页内运行器只跑 Python 代码，不能执行终端命令；出现 <code class="inline">ModuleNotFoundError</code> 时按顺序查：没安装 → 装在另一个环境 → 文件名冲突。</p>`
  }
],

/* ---------- 第 12 章 ---------- */
12: [
  {
    h: "一份最小验证清单（讲义 12）",
    html: `
      <table class="mini">
        <thead><tr><th>检查方向</th><th>成绩场景中的例子</th></tr></thead>
        <tbody>
          <tr><td>正常情况</td><td>三名学生，85 / 58 / 92 分</td></tr>
          <tr><td>边界情况</td><td>0、60、90、100 分</td></tr>
          <tr><td>空数据</td><td>零条记录，均值和及格率怎么表示</td></tr>
          <tr><td>非法数据</td><td>缺失、文字、负数、超过 100、无穷与非数</td></tr>
          <tr><td>口径</td><td>缺考算不算分母；一人多条成绩怎么处理</td></tr>
          <tr><td>输出核对</td><td>有效条数 + 无效条数 = 总条数</td></tr>
          <tr><td>修改回归</td><td>改了及格线，其他规则是否仍然成立</td></tr>
        </tbody>
      </table>
      <ul>
        <li>浮点比较用 <code class="inline">math.isclose(a, b)</code>，别总指望 <code class="inline">==</code>。</li>
        <li><code class="inline">assert</code> 适合开发期与教学检查；<code class="inline">python -O</code> 优化模式会移除断言，正式校验要用明确判断 + 异常。</li>
        <li>测试不是证明程序永远正确，而是用有代表性的样例降低改动出错的风险。</li>
        <li>AI 也能提测试，但可能与实现一起误解需求——验收标准必须由人先确认。</li>
      </ul>`
  }
]

};

/* =========================================================
   第 13-18 章：讲义 08 / 13 / 14 / 15 / 16 / 17 的章节化
   ========================================================= */
window.MORE_CHAPTERS = [
{
  num: 13, title: "对象与类",
  goal: "本章目标：看懂点号后面的东西，并会给“一类数据”建模型。",
  intro: [
    "你其实早就在用对象了：<code class='inline'>\"abc\".upper()</code>、<code class='inline'>[1, 2].append(3)</code>——点号前面是对象，后面是它自带的东西。数字、字符串、列表、函数，在 Python 里都是对象。",
    "<code class='inline'>对象.属性</code> 读信息，<code class='inline'>对象.方法(...)</code> 做事。能用哪些名字由<b>类型</b>决定：字符串有 upper，列表就没有。",
    "<code class='inline'>class</code> 是造对象的模板：<code class='inline'>class Student:</code> 定义一类东西，<code class='inline'>__init__</code> 负责初始化，<code class='inline'>self</code> 指“当前这个对象”。调用 <code class='inline'>Student(\"小林\", 85)</code> 时，__init__ 自动执行。",
    "什么时候该建类：一条记录要“数据 + 行为”一起走（比如学生自带“是否及格”的判断），或者同类对象要反复创建。只是存几个字段，用字典更省事——<b>别为了面向对象而建类</b>。"
  ],
  example: {
    scene: "日常场景：一张会自己判断及格的学生卡",
    code: `class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def label(self):
        return "及格" if self.score >= 60 else "待提高"

s1 = Student("小林", 85)
print(s1.name, s1.score, s1.label())`,
    output: "小林 85 及格",
    note: "属性用 self.xxx 存，方法第一个参数永远是 self（调用时不用自己传）。label() 里能直接用 self.score，说明对象记得自己的数据。"
  },
  exercises: [
    {
      title: "给计数器加一加",
      read: {
        story: "这段代码定义了一个计数器：每调一次 add() 就加一次，还能指定加多少。",
        points: [
          "<code class='inline'>__init__</code> 里 <code class='inline'>self.n = 0</code> 是这个对象自己的计数器，不是全局变量。",
          "<code class='inline'>def add(self, k=1)</code> 的 k 有默认值 1，所以 add() 等于 add(1)。",
          "<code class='inline'>self.n = self.n + k</code> 先算右边，再写回对象自己的 n。"
        ]
      },
      target: `class Counter:
    def __init__(self):
        self.n = 0

    def add(self, k=1):
        self.n = self.n + k
        return self.n

c = Counter()
c.add()
c.add(3)
print(c.n)`,
      guess: {
        q: "先猜一猜：运行后输出什么？",
        options: ["0", "1", "3", "4"],
        answer: 3,
        reveal: "<b>答案：4。</b>① c = Counter() 时 n 变成 0 → ② c.add() 默认加 1，n = 1 → ③ c.add(3)，n = 1 + 3 = 4 → ④ print(c.n) 打印 4。"
      },
      modify: {
        prompt: "改一点试试：把第一个 c.add() 改成 c.add(10)，输出是多少？",
        options: ["10", "13", "14", "4"],
        answer: 1,
        reveal: "<b>答案：13。</b>n = 0 → 加 10 得 10 → 加 3 得 13。默认参数只在“不传”时才生效。"
      }
    },
    {
      title: "属性与方法分别要什么",
      read: {
        story: "一个订单对象：属性存价格和数量，方法算出总价。",
        points: [
          "<code class='inline'>o.total()</code> 是<b>方法</b>，要加括号才会执行并返回结果。",
          "<code class='inline'>o.count</code> 是<b>属性</b>，直接取值，不加括号。",
          "print 里用逗号分隔多个值，会按顺序用空格连起来输出。"
        ]
      },
      target: `class Order:
    def __init__(self, price, count):
        self.price = price
        self.count = count

    def total(self):
        return self.price * self.count

o = Order(12, 3)
print(o.total(), o.count)`,
      guess: {
        q: "先猜一猜：输出什么？",
        options: ["36 3", "12 3", "36 36", "报错"],
        answer: 0,
        reveal: "<b>答案：36 3。</b>total() 返回 12 * 3 = 36，count 属性是 3，按顺序打印。"
      },
      modify: {
        prompt: "改一点试试：把最后一行改成 print(o.count, o.total())，输出变成什么？",
        options: ["3 36", "36 3", "3 3", "报错"],
        answer: 0,
        reveal: "<b>答案：3 36。</b>print 按你写的顺序输出：先 count 后 total()。方法必须带括号才是“调用”。"
      }
    }
  ]
},
{
  num: 14, title: "表格与图表",
  goal: "本章目标：用列表 + 字典当“一张表”，会按列取值、按条件筛行、按类别汇总。",
  intro: [
    "一张表，拆开看就是<b>列表里套字典</b>：列表代表所有行，每个字典代表一行，键就是列名。<code class='inline'>students[1][\"score\"]</code> 读作：第 2 条记录的分数。",
    "选一列 = 逐行取同一个键；筛行 = 加条件；汇总 = <code class='inline'>sum</code> / <code class='inline'>len</code> / <code class='inline'>max</code>。这些用第 5 章的推导式一行就能写完。",
    "分组汇总是最常见的操作：先建一个空字典，再逐行按“班级”当键累加。看懂了这一步，pandas 的 <code class='inline'>groupby</code> 就是同一件事的库版本。",
    "pandas 与 matplotlib 要额外安装，页内运行器跑不了；本章示例用标准库演示同样的思路，把机制先弄明白，换库只是换写法。"
  ],
  example: {
    scene: "日常场景：一张三人成绩表",
    code: `students = [
    {"name": "小林", "cls": "一班", "score": 85},
    {"name": "小陈", "cls": "一班", "score": 58},
    {"name": "小周", "cls": "二班", "score": 92},
]

passed = [s["name"] for s in students if s["score"] >= 60]
avg = sum(s["score"] for s in students) / len(students)
print("及格：", passed)
print("平均分：", round(avg, 1))`,
    output: "及格： ['小林', '小周']\n平均分： 78.3",
    note: "第一行是筛选 + 取值（推导式），第二行是聚合求和再求平均。(85 + 58 + 92) / 3 = 78.33…，round 到一位小数就是 78.3。"
  },
  exercises: [
    {
      title: "按班级汇总总分",
      read: {
        story: "这段代码按班级分组，把每个班的总分累加进一个字典。",
        points: [
          "<code class='inline'>totals</code> 是“班级 → 总分”的映射，一开始是空的。",
          "<code class='inline'>totals.get(s[\"cls\"], 0)</code> 的意思是：有这个班就取当前累计值，没有就从 0 开始。",
          "每轮把当前学生的分数加上去，再写回同一个键。"
        ]
      },
      target: `students = [
    {"name": "小林", "cls": "一班", "score": 85},
    {"name": "小陈", "cls": "一班", "score": 58},
    {"name": "小周", "cls": "二班", "score": 92},
]

totals = {}
for s in students:
    totals[s["cls"]] = totals.get(s["cls"], 0) + s["score"]

print(totals)`,
      guess: {
        q: "先猜一猜：print(totals) 输出什么？",
        options: [
          "{'一班': 143, '二班': 92}",
          "{'一班': 71.5, '二班': 92}",
          "{'一班': 85, '二班': 92}",
          "报错"
        ],
        answer: 0,
        reveal: "<b>答案：{'一班': 143, '二班': 92}。</b>一班 85 + 58 = 143，二班 92。这里累加的是总分，不是平均分。"
      },
      modify: {
        prompt: "改一点试试：把 totals.get(s[\"cls\"], 0) 里的 0 改成 100，输出变成什么？",
        options: [
          "{'一班': 243, '二班': 192}",
          "{'一班': 143, '二班': 92}",
          "{'一班': 143, '二班': 192}",
          "报错"
        ],
        answer: 0,
        reveal: "<b>答案：{'一班': 243, '二班': 192}。</b>每个班第一次出现时从 100 起算：一班 100 + 85 + 58 = 243，二班 100 + 92 = 192。默认值会污染结果——这正是“别用默认值掩盖缺失”的例子。"
      }
    },
    {
      title: "找出最高分那一行",
      read: {
        story: "每行存成 (分数, 姓名) 的元组，直接用 max 拿到最高分那一行。",
        points: [
          "元组比较按位置从左到右：先比第一个元素（分数），分数相同再比第二个。",
          "<code class='inline'>max(rows)</code> 返回整行 <code class='inline'>(92, '小周')</code>，不是单个数字。",
          "所以要 <code class='inline'>top[1]</code> 取姓名、<code class='inline'>top[0]</code> 取分数。"
        ]
      },
      target: `rows = [(85, "小林"), (58, "小陈"), (92, "小周")]
top = max(rows)
print(top[1], top[0])`,
      guess: {
        q: "先猜一猜：输出什么？",
        options: ["小林 85", "小周 92", "92 小周", "报错"],
        answer: 1,
        reveal: "<b>答案：小周 92。</b>max 找到 (92, '小周')，然后按代码顺序先打印 top[1] 姓名、再打印 top[0] 分数。"
      },
      modify: {
        prompt: "改一点试试：把 max(rows) 改成 min(rows)，输出是什么？",
        options: ["小陈 58", "小周 92", "58 小陈", "报错"],
        answer: 0,
        reveal: "<b>答案：小陈 58。</b>min 拿到 (58, '小陈')，同样先姓名后分数。元组的“按位置比较”让这种写法很省事。"
      }
    }
  ]
},
{
  num: 15, title: "API 与 AI 调用",
  goal: "本章目标：明白“调 AI”其实就是按约定发一个请求、再解析一个响应。",
  intro: [
    "API 是程序之间的约定接口。一次 HTTP 请求通常由四部分组成：<b>地址</b>（发给谁）、<b>方法</b>（GET 取、POST 交）、<b>请求头</b>（认证、格式，比如 Authorization 带 Key）、<b>请求体</b>（要传的数据）。",
    "响应也分两半：<b>状态码</b>和<b>数据</b>。200 成功；401 / 403 是 Key 不对或没权限；429 请求太频繁被限流；5xx 是服务端出问题。数据一般是 JSON。",
    "页面上的 AI 面板做的就是这件事：把你的问题 + 当前代码打包成 JSON，带着 Key 发给模型，再把返回的文字解析出来显示。网络断了、Key 错了，都要给能看懂的人话提示。",
    "有两条底线：<b>Key 是钥匙</b>，不写进代码仓库、不共享给别人；<b>模型会出错</b>，数值统计这类确定的事交给代码算，模型负责解释和归纳，最后靠样例核对。"
  ],
  example: {
    scene: "日常场景：把一次 AI 请求打包成 JSON（不联网）",
    code: `import json

payload = {
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "解释 print(1 + 1)"}],
}

body = json.dumps(payload, ensure_ascii=False)
print(type(body).__name__)
print(json.dumps({"ok": True}))
print("消息条数：", len(payload["messages"]))`,
    output: "str\n{\"ok\": true}\n消息条数： 1",
    note: "真正发请求还要加 URL、Authorization 头和超时设置；这里只练“把数据打包成 JSON 字符串”这一步，所以不联网也能跑。注意 Python 的 True 变成 JSON 的 true。"
  },
  exercises: [
    {
      title: "解析一段响应",
      read: {
        story: "这段代码把一段 JSON 文本解析成字典，再取出状态码和回答内容。",
        points: [
          "<code class='inline'>json.loads</code> 把<b>字符串</b>变成 Python 字典（loads 的 s 指 string）。",
          "解析后就能用键取值：<code class='inline'>data[\"status\"]</code>。",
          "响应里的字段名由接口约定，写错了就是 KeyError。"
        ]
      },
      target: `import json

resp = '{"status": 200, "answer": "1 + 1 等于 2"}'
data = json.loads(resp)
print(data["status"], data["answer"])`,
      guess: {
        q: "先猜一猜：输出什么？",
        options: ["200 1 + 1 等于 2", "报错", "{'status': 200}", "200 None"],
        answer: 0,
        reveal: "<b>答案：200 1 + 1 等于 2。</b>loads 之后 data 就是普通字典，status 是整数 200，answer 是字符串。"
      },
      modify: {
        prompt: "改一点试试：把最后一行改成 print(data[\"reason\"])，会怎样？",
        options: ["报错：KeyError", "输出 None", "输出空行", "输出 200"],
        answer: 0,
        reveal: "<b>答案：报错 KeyError。</b>字典里没有 reason 这个键。这就是为什么解析外部响应时要先判断键是否存在，或用 .get() 给默认值。"
      }
    },
    {
      title: "把状态码翻译成人话",
      read: {
        story: "接口出问题时，用户看不懂 401、429 这些数字，这段代码把它们翻译成能行动的提示。",
        points: [
          "函数按状态码走不同分支，最后一句 return 兜住所有没列举的情况。",
          "<code class='inline'>status in (401, 403)</code> 判断“是否属于这个元组”，一次覆盖两个值。",
          "分支从上往下，命中第一个就返回，不会继续往下执行。"
        ]
      },
      target: `def explain(status):
    if status == 200:
        return "成功"
    if status in (401, 403):
        return "Key 不对或没权限"
    if status == 429:
        return "请求太频繁"
    return "服务端或网络问题"

print(explain(401), "|", explain(429), "|", explain(500))`,
      guess: {
        q: "先猜一猜：输出什么？",
        options: [
          "Key 不对或没权限 | 请求太频繁 | 服务端或网络问题",
          "成功 | 请求太频繁 | 服务端或网络问题",
          "服务端或网络问题 | 请求太频繁 | Key 不对或没权限",
          "报错"
        ],
        answer: 0,
        reveal: "<b>答案：Key 不对或没权限 | 请求太频繁 | 服务端或网络问题。</b>401 命中第二支，429 命中第三支，500 落到最后的兜底。"
      },
      modify: {
        prompt: "改一点试试：把 print 里的 explain(401) 改成 explain(200)，输出变成什么？",
        options: [
          "成功 | 请求太频繁 | 服务端或网络问题",
          "Key 不对或没权限 | 请求太频繁 | 服务端或网络问题",
          "成功 | 请求太频繁 | 成功",
          "报错"
        ],
        answer: 0,
        reveal: "<b>答案：成功 | 请求太频繁 | 服务端或网络问题。</b>只换了第一个入参，后两个分支不变。"
      }
    }
  ]
},
{
  num: 16, title: "与 AI 协作",
  goal: "本章目标：把“我想要什么”说清楚，让 AI 产出可验证的代码，而不是看起来对的代码。",
  intro: [
    "分工先定清楚：<b>人负责目标与验收，AI 负责实现</b>。推荐的顺序是：描述问题 → 明确规则 → 给出样例 → 拆成步骤 → 让小步生成 → 运行核对 → 再扩展。",
    "提问六件套：<b>目标</b>、<b>输入结构</b>、<b>处理规则</b>、<b>输出格式</b>、<b>限制条件</b>、<b>验收样例</b>。样例越具体，AI 越不容易自由发挥。",
    "按问题类型换问法：读不懂就让“用具体输入把每个变量走一遍”；报错就给“最小复现代码 + 完整报错 + 运行方式”；结果不对就让“用边界样例找反例”；想练手就让“先给提示，等我答完再反馈”。",
    "AI 生成之后必须自己检查五件事：能不能解释关键行、依赖是否真的存在、有没有读写预期之外的文件、测试是否覆盖边界、Key 有没有泄露。<b>看不懂的代码，先缩小范围再运行</b>。"
  ],
  example: {
    scene: "日常场景：把需求写成一段结构化提问",
    code: `task = "统计学生平均分"
inputs = "列表，每条含 name 和 score"
rules = ["有效分数 0～100", "无效记录不计入分母", "空列表返回 None"]
samples = [([{"name": "A", "score": 80}], 80.0), ([], None)]

prompt = f"任务：{task}\\n输入：{inputs}\\n规则：{'；'.join(rules)}\\n样例：{len(samples)} 组"
print(prompt)
print("规则条数：", len(rules))`,
    output: "任务：统计学生平均分\n输入：列表，每条含 name 和 score\n规则：有效分数 0～100；无效记录不计入分母；空列表返回 None\n样例：2 组\n规则条数： 3",
    note: "这段提示词里最关键的不是措辞，而是“规则 + 样例”——它们同时也是你后面验收的标准。规则写不清，AI 只能猜。"
  },
  exercises: [
    {
      title: "什么问题配什么问法",
      read: {
        story: "不同的问题要用不同的求助方式，这段代码把对应关系存在字典里。",
        points: [
          "字典的键是“问题类型”，值是对应的问法。",
          "<code class='inline'>tips[\"报错\"]</code> 按精确的键取值，键必须完全一致。",
          "字典适合这种“查表”场景，比一堆 if 清楚。"
        ]
      },
      target: `tips = {
    "读不懂": "逐个变量走一遍给我看",
    "报错": "这是最小复现代码和完整报错",
    "结果不对": "用边界样例帮我找反例",
}
print(tips["报错"])`,
      guess: {
        q: "先猜一猜：输出什么？",
        options: [
          "这是最小复现代码和完整报错",
          "逐个变量走一遍给我看",
          "用边界样例帮我找反例",
          "报错"
        ],
        answer: 0,
        reveal: "<b>答案：这是最小复现代码和完整报错。</b>键是“报错”，取到的就是它对应的值。"
      },
      modify: {
        prompt: "改一点试试：把最后一行改成 print(tips[\"结果不对\"])，输出是什么？",
        options: [
          "用边界样例帮我找反例",
          "这是最小复现代码和完整报错",
          "报错",
          "输出空行"
        ],
        answer: 0,
        reveal: "<b>答案：用边界样例帮我找反例。</b>换键就换值。如果键写错成不存在的词，会抛 KeyError——这也是字典查找的特点。"
      }
    },
    {
      title: "交付前的五道检查",
      read: {
        story: "AI 写完代码后，用一份清单逐项打勾，全过才算能交付。",
        points: [
          "<code class='inline'>len(checks)</code> 是清单的项数，这里 5 项。",
          "f-string 的 <code class='inline'>{}</code> 里可以放表达式，这里是条件表达式，二选一输出。",
          "<code class='inline'>passed == len(checks)</code> 表示“全过”。"
        ]
      },
      target: `checks = ["能解释关键行", "依赖存在", "未读写意外文件", "覆盖边界", "Key 未泄露"]
passed = 4
print(f"{passed}/{len(checks)} 项通过，{'可以交付' if passed == len(checks) else '还不能交付'}")`,
      guess: {
        q: "先猜一猜：输出什么？",
        options: [
          "5/5 项通过，可以交付",
          "4/5 项通过，还不能交付",
          "4 项通过",
          "报错"
        ],
        answer: 1,
        reveal: "<b>答案：4/5 项通过，还不能交付。</b>4 不等于 5，条件表达式走 else 分支。差一项也是没通过——清单的意义就在这。"
      },
      modify: {
        prompt: "改一点试试：把 passed = 4 改成 passed = 5，输出变成什么？",
        options: [
          "5/5 项通过，可以交付",
          "4/5 项通过，还不能交付",
          "5/5 项通过，还不能交付",
          "报错"
        ],
        answer: 0,
        reveal: "<b>答案：5/5 项通过，可以交付。</b>两项都跟着变：分子变成 5，条件也成立。"
      }
    }
  ]
},
{
  num: 17, title: "综合项目：成绩报告",
  goal: "本章目标：把校验、分离、汇总、输出串成一条可验证的流水线。",
  intro: [
    "一份数据要经过五步：<b>准备原始记录 → 校验并转换 → 分离有效与无效 → 计算汇总 → 输出并核对</b>。每一步的输出都是下一步的输入，出问题时能定位到具体环节。",
    "口径必须提前定死：每条记录按一次成绩计数；姓名不能为空；分数必须是 0～100 的有限数；<b>无效记录不进入均值和及格率的分母</b>；没有有效数据时返回 <code class='inline'>None</code> 而不是 0。",
    "为什么要先校验再汇总：计算函数只面对干净数据，逻辑才简单；有问题的数据单独留档，方便追溯“为什么这条没算进去”。",
    "验收时回答四个问题：空数据怎么办？非法数据去哪了？结果保存在哪？哪些规则是你定的、哪些代码是 AI 写的？"
  ],
  example: {
    scene: "日常场景：一份带无效记录的成绩单",
    code: `raw = [
    {"name": "小林", "score": 85},
    {"name": "小陈", "score": 58},
    {"name": "", "score": 90},
    {"name": "小周", "score": 120},
    {"name": "小吴", "score": 92},
]

def valid(r):
    name = r.get("name", "").strip()
    score = r.get("score")
    ok_num = isinstance(score, (int, float)) and not isinstance(score, bool)
    return bool(name) and ok_num and 0 <= score <= 100

good = [r for r in raw if valid(r)]
bad = [r for r in raw if not valid(r)]
avg = sum(r["score"] for r in good) / len(good) if good else None
print("有效：", len(good), "无效：", len(bad))
print("平均分：", round(avg, 2) if avg is not None else None)`,
    output: "有效： 3 无效： 2\n平均分： 78.33",
    note: "空名字和小周那 120 分都被剔除了，而且没进分母——所以平均分是 (85 + 58 + 92) / 3 = 78.33，不是除以 5。这就是“口径”对结果的影响。"
  },
  exercises: [
    {
      title: "算及格率",
      read: {
        story: "及格率 = 及格人数 / 总人数，先筛选再相除。",
        points: [
          "<code class='inline'>passed</code> 是筛选出的及格分数列表。",
          "<code class='inline'>len(passed) / len(scores)</code> 是人数之比，结果是 0～1 的小数。",
          "<code class='inline'>round(x, 2)</code> 保留两位小数。"
        ]
      },
      target: `scores = [85, 58, 92, 40]
passed = [s for s in scores if s >= 60]
rate = len(passed) / len(scores)
print(len(passed), round(rate, 2))`,
      guess: {
        q: "先猜一猜：输出什么？",
        options: ["4 1.0", "2 0.5", "2 0.67", "报错"],
        answer: 1,
        reveal: "<b>答案：2 0.5。</b>及格的是 85 和 92 两人，2 / 4 = 0.5。"
      },
      modify: {
        prompt: "改一点试试：把筛选条件 s >= 60 改成 s >= 50，输出变成什么？",
        options: ["3 0.75", "2 0.5", "3 0.6", "报错"],
        answer: 0,
        reveal: "<b>答案：3 0.75。</b>及格线降到 50 后，85、58、92 都算及格 → 3 / 4 = 0.75。改口径，结果就要重新核对。"
      }
    },
    {
      title: "空数据怎么保住",
      read: {
        story: "没有数据时不能直接算平均分——除数为 0 会报错，这段代码先判断再计算。",
        points: [
          "<code class='inline'>if scores:</code> 判断列表非空（空列表为假）。",
          "非空才算 <code class='inline'>sum / len</code>，空列表走 else 给 <code class='inline'>None</code>。",
          "<code class='inline'>None</code> 表示“没有结果”，和 0 分是两件完全不同的事。"
        ]
      },
      target: `scores = []
if scores:
    avg = sum(scores) / len(scores)
else:
    avg = None
print(avg)`,
      guess: {
        q: "先猜一猜：输出什么？",
        options: ["0", "None", "报错 ZeroDivisionError", "空行"],
        answer: 1,
        reveal: "<b>答案：None。</b>空列表为假，走 else 分支。None 打印出来就是 None。"
      },
      modify: {
        prompt: "改一点试试：把 if scores: 改成 if not scores:，会怎样？",
        options: ["报错：ZeroDivisionError", "输出 None", "输出 0", "输出空行"],
        answer: 0,
        reveal: "<b>答案：报错 ZeroDivisionError。</b>判断反了：空列表时进了“要计算”的分支，sum([]) / len([]) 就是除以 0。空数据保护写反，比不写更危险——它看着有保护。"
      }
    }
  ]
},
{
  num: 18, title: "基础地图与自测",
  goal: "本章目标：用一张图看清学过什么，再用自测确认哪些能脱离讲义讲出来。",
  intro: [
    "把前 17 章连起来看，知识分六层：<b>数据</b>（值 → 类型 → 变量 → 容器 → 多条记录）、<b>规则</b>（表达式 → 条件 → 循环）、<b>组织</b>（函数 → 模块 → 包；对象与类）、<b>连接</b>（文件 → CSV / JSON → 第三方库 → API）、<b>质量</b>（报错 → 调试 → 输入校验 → 测试）、<b>协作</b>（明确需求 → AI 辅助 → 人工验证）。",
    "还有一批主题有用但不必现在掌握：正则表达式、日期与时区、生成器、装饰器、递归、继承与多态进阶、异步并发、数据库、Web 开发、打包发布、Git、专业测试框架。<b>“看过一篇概览”不等于掌握</b>，等具体任务需要时再展开。",
    "首课的完成标准不是背语法，而是：面对一个小程序，能找出<b>数据、规则、步骤、外部依赖、验证方法</b>这五样东西。",
    "下面的自测题请先合上讲义口头回答，再回章节核对。答不上来的那一章，才是你真正要重练的地方。"
  ],
  example: {
    scene: "日常场景：把知识地图打印出来",
    code: `map_lines = [
    "数据：值 → 类型 → 变量 → 容器 → 多条记录",
    "规则：表达式 → 条件 → 循环",
    "组织：函数 → 模块 → 包；对象与类",
    "连接：文件 → CSV / JSON → 第三方库 → API",
    "质量：报错 → 调试 → 输入校验 → 测试",
    "协作：明确需求 → AI 辅助 → 人工验证",
]
for line in map_lines:
    print(line)`,
    output: "数据：值 → 类型 → 变量 → 容器 → 多条记录\n规则：表达式 → 条件 → 循环\n组织：函数 → 模块 → 包；对象与类\n连接：文件 → CSV / JSON → 第三方库 → API\n质量：报错 → 调试 → 输入校验 → 测试\n协作：明确需求 → AI 辅助 → 人工验证",
    note: "这六行就是整个讲义的主干。以后遇到新知识点，先问它挂在哪一层——比零散记语法有用得多。"
  },
  exercises: [
    {
      title: "自测：条件顺序与边界",
      read: {
        story: "同一组规则，条件顺序和比较符号只要动一个字符，结果就会变。",
        points: [
          "<code class='inline'>if / elif</code> 从上往下，命中第一个就返回。",
          "<code class='inline'>&gt;= 90</code> 包含 90 分，90 分算“优秀”。",
          "最后的 <code class='inline'>return \"待提高\"</code> 兜住所有低于 60 的分。"
        ]
      },
      target: `def level(score):
    if score >= 90:
        return "优秀"
    elif score >= 60:
        return "及格"
    return "待提高"

print(level(90), level(59), level(100))`,
      guess: {
        q: "先猜一猜：输出什么？",
        options: ["优秀 待提高 优秀", "及格 待提高 优秀", "优秀 及格 优秀", "报错"],
        answer: 0,
        reveal: "<b>答案：优秀 待提高 优秀。</b>90 命中第一支（&gt;= 包含 90），59 两支都不中落到兜底，100 命中第一支。"
      },
      modify: {
        prompt: "改一点试试：把 score >= 90 改成 score > 90，输出变成什么？",
        options: ["及格 待提高 优秀", "优秀 待提高 优秀", "及格 待提高 及格", "报错"],
        answer: 0,
        reveal: "<b>答案：及格 待提高 优秀。</b>90 不再满足“&gt; 90”，掉到第二支的“及格”；100 仍然优秀。边界差一个等号，结论就变了——这就是为什么边界要专门测。"
      }
    },
    {
      title: "自测：嵌套循环与计数",
      read: {
        story: "字典里每个键对应一个列表，双层循环把所有数字加起来。",
        points: [
          "<code class='inline'>sorted(data)</code> 把键排好序（a、b），保证遍历顺序可预期。",
          "外层遍历键，内层遍历该键对应的列表。",
          "<code class='inline'>total += v</code> 是累计写法，等价于 total = total + v。"
        ]
      },
      target: `data = {"a": [1, 2], "b": [3]}
total = 0
for k in sorted(data):
    for v in data[k]:
        total += v
print(total)`,
      guess: {
        q: "先猜一猜：输出什么？",
        options: ["3", "6", "12", "报错"],
        answer: 1,
        reveal: "<b>答案：6。</b>a 下面有 1、2，b 下面是 3，全部相加 1 + 2 + 3 = 6。"
      },
      modify: {
        prompt: "改一点试试：把 total += v 改成 total += 1（只数个数），输出变成什么？",
        options: ["2", "3", "6", "报错"],
        answer: 1,
        reveal: "<b>答案：3。</b>不管值是多少每次只加 1：a 有 2 个元素、b 有 1 个，共 3 次。同一个循环，累加“值”还是累加“次数”，结果完全不同。"
      }
    }
  ]
}
];

