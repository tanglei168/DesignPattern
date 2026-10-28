import type { StyleSeed } from "./types";
import { buildTokens, resolvedValue } from "@/lib/styles/tokens";
import appleIndex from "@/lib/styles/sources/apple-reference-index.json";

export const SPEC_SECTIONS = ["设计目标", "视觉基础", "布局与导航", "组件规范", "交互与状态", "内容与无障碍", "验收"] as const;
export type SpecSection = typeof SPEC_SECTIONS[number];
export type DesignRule = {
  id: string;
  section: SpecSection;
  title: string;
  purpose: string;
  anatomy: string;
  web: string;
  mobile: string;
  states: string;
  avoid: string;
  acceptance: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  basis: string;
  source?: string;
  sourceHeading?: string;
};
export type DesignSpec = {
  level: "详细规则" | "基础拆解";
  scope: string;
  rules: DesignRule[];
};

export const appleReferenceIndex = appleIndex;
export const appleSource = `${appleIndex.repository}/blob/${appleIndex.revision}`;
const method = `${appleSource}/SKILL.md`;
const wcag = "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html";

// These are authored requirements, not claims that the preview has passed an audit.
function rule(id: string, section: SpecSection, title: string, purpose: string, anatomy: string, web: string, mobile: string, states: string, avoid: string, acceptance: string, extra: Partial<DesignRule> = {}): DesignRule {
  return { id, section, title, purpose, anatomy, web, mobile, states, avoid, acceptance, severity: "High", basis: "项目设计决策；不是官方平台标准", ...extra };
}

function foundation(seed: StyleSeed): DesignRule[] {
  const tokens = buildTokens(seed);
  const value = (name: string) => {
    const token = tokens.all.find(item => item.cssVar === name);
    return token ? resolvedValue(token, tokens.vars) : "未定义";
  };
  return [
    rule("purpose", "设计目标", "场景、用户与核心任务", seed.summary,
      `适用：${seed.useCases.join("、")}。设计原则：${seed.principles.join(" ")}`,
      seed.platformNotes.web, seed.platformNotes.mobile,
      "区分首次使用、日常任务、异常恢复；每个页面写明一个核心任务。",
      "只替换颜色就声称复现完整设计系统；用装饰取代任务层级。",
      "从入口完成一个核心任务并返回；记录步骤、阻断点和业务结果。", { severity: "Medium", basis: "当前风格定义；待业务场景验证" }),
    rule("color", "视觉基础", "颜色角色与对比", "用颜色表达层级与状态，而不是为每个控件独立上色。",
      `画布 ${seed.colors.background}；表面 ${seed.colors.surface}；正文 ${seed.colors.foreground}；次文字 ${seed.colors.muted}；主动作 ${value("--button-bg")} / ${value("--button-fg")}。`,
      "分别检查正文/表面、链接/表面、按钮文字/填充、选中项/导航；透明色先与实际底色合成。",
      "同一语义继续使用同名 token；不能因为窄屏换掉状态含义；触控按下态也要计算对比。",
      "默认、悬停、按下、聚焦、选中；暗色配对未定义时必须标明未支持。",
      "把深色侧栏叫作完整暗色模式；把警告黄直接用于白底小字。",
      "记录实际前景/背景和对比数值。Web 普通文本 ≥4.5:1；大字 ≥3:1，且至少 24 CSS px 或粗体约 18.67 CSS px；不能对阈值四舍五入。",
      { severity: "Critical", basis: "色值来自当前种子；Web 对比阈值来自 WCAG 2.2 SC 1.4.3", source: wcag, sourceHeading: "Success Criterion / Large-scale" }),
    rule("type", "视觉基础", "字体、层级与数据排版", "用字号和字重说明信息的重要性，保持可读性。",
      `正文 ${seed.typography.baseSize}px / ${seed.typography.bodyWeight}；标题字重 ${seed.typography.headingWeight}；字号比例 ${seed.typography.scaleRatio}；字体栈 ${seed.typography.sans}。这些是当前画廊值。`,
      "页面标题、分区标题、正文、辅助信息各有固定角色；数值列对齐，单位不丢失。",
      "优先保证正文和字段标签可读；允许换行和行高增长，不按桌面画布等比缩小。",
      "默认、长文案、中英文混排、200% 放大、缺失字体回退。",
      "把几何比例推算的字号表宣称为某平台官方字阶；固定容器高度裁掉放大文字。",
      "以两倍字号或缩放检查长标题、按钮、表格与弹层；关掉自定义字体检查回退。"),
    rule("shape", "视觉基础", "间距、形状与材质", "相同层级使用一致几何语言，靠分组减少视觉噪声。",
      `控件圆角 ${value("--button-radius")}；卡片圆角 ${value("--card-radius")}；控件描边 ${value("--button-border-width")}；卡片阴影 ${value("--card-shadow")}。`,
      "控件内部间距小于模块之间间距；表格、表单、卡片的左边界对齐。",
      "保留触控间距和安全区；减少并排元素数量，而不是压缩文字与热区。",
      "默认、浮层、滚动覆盖、减少透明度；模糊不可用时提供实色表面。",
      "所有层级都加阴影或毛玻璃；仅凭同一圆角推断两个组件行为相同。",
      "检查相邻控件误触风险、滚动时可读性和不支持模糊时的回退。", { severity: "Medium" }),
    rule("layout", "布局与导航", "空间适配与任务连续性", "在不同宽度保持功能和用户位置，改变信息组织方式。",
      "页面由导航、标题、任务工具栏、内容和反馈构成；断点由内容能否容纳决定。",
      "宽屏可并排导航和内容；筛选条件与数据上下相邻；为宽表格提供局部滚动。",
      "窄屏折叠次要信息；导航与操作分开；保留筛选、查看详情、返回与恢复状态的入口。",
      "宽窄切换、横竖屏、键盘弹出、返回、长内容。",
      "隐藏桌面侧栏后同时丢失功能；把所有设备宽度硬套同一断点。",
      "在 320、390、768、1280 CSS px 宽度完成同一任务；除宽表格外页面无水平溢出。测试尺寸是项目检查点，不是平台标准。"),
    rule("buttons", "组件规范", "按钮：层级、反馈与阻止重复提交", "让用户知道可以做什么、操作是否被接收。",
      `组成：文字、可选图标、加载指示。变体：主、次、文字、危险。当前控件高度 ${value("--size-control")}，这是当前预览值，不是所有平台下限。`,
      "一个操作组突出最重要动作；支持鼠标和键盘；图标按钮有可访问名称。",
      "增加触控热区；关键操作不能依赖 hover；长文案允许按钮增长。",
      "默认、hover（指针）、pressed、focus-visible、disabled、loading、success、error。",
      "只有颜色变化没有按下反馈；视觉禁用但仍执行；加载时重复创建记录。",
      "连续双击只提交一次；Tab/Enter/Space 可操作；加载结束读出成功或失败；禁用原因可理解。"),
    rule("forms", "组件规范", "表单：标签、帮助与错误恢复", "让用户一次填对，并在失败后保留已有输入。",
      "组成：可见标签、输入控件、单位/提示、错误文本；标签不能只用 placeholder。",
      "按自然阅读顺序排列字段；错误紧邻字段；提交失败聚焦首个错误项。",
      "使用合适的输入类型；键盘弹出后字段与错误仍可见；避免横向密集多列。",
      "空白、输入、聚焦、有效、无效、只读、禁用、提交中、提交失败。",
      "错误只用红边；失败后清空已填内容；每输入一个字符就用弹窗打断。",
      "空值、非法值、长值和网络失败各走一次；屏幕阅读器能关联标签、提示与错误。"),
    rule("data", "组件规范", "列表、表格与详情", "支持扫描、比较和查看对象详情。",
      "标题、列名或字段标签、数据项、状态、行操作；排序与筛选要有可见结果。",
      "比较多字段时用表格；排序指示方向；批量选择展示数量和作用范围。",
      "保留名称、核心状态和摘要；次要字段进入详情；需要横向比较时允许有说明的表格滚动。",
      "加载、有数据、无数据、筛选无结果、失败、选择、分页。",
      "所有移动数据强制卡片化；窄屏直接藏掉必要字段却不给详情入口。",
      "对比过滤前后结果；返回后恢复条件和位置；验证无结果与请求失败不是同一状态。"),
    rule("feedback", "交互与状态", "反馈与可恢复流程", "告诉用户发生了什么，并提供下一步。",
      "就地反馈、进度、空状态、错误、可撤销结果；阻断式弹层仅用于必要决策。",
      "长操作可继续浏览，完成后给结果入口；失败时保留筛选与输入。",
      "反馈不遮挡主要操作和系统安全区；可恢复操作优先撤销。",
      "idle → pending → success / error；取消不等于失败；空数据不等于加载中。",
      "永不结束的骨架屏；所有结果弹 alert；只有关闭按钮没有恢复方案。",
      "模拟慢响应、超时、失败和重试；检查是否保留上下文与防止重复请求。"),
    rule("a11y", "内容与无障碍", "键盘、读屏与非视觉线索", "核心任务不依赖单一感官或输入方式。",
      "语义标题、名称、角色、状态、可见焦点、状态文本；图标装饰与操作图标区分。",
      "Tab 顺序与视觉顺序相符；弹层管理焦点，关闭后还给触发者；不覆盖系统快捷键。",
      "颜色之外提供文字；滑动动作有可点替代；尊重减少动态效果设置。",
      "键盘、读屏、缩放、减少动效、无颜色识别。",
      "以 token 测试通过代替整页无障碍验收；图标按钮无名称。",
      "不用鼠标完成核心流程；用读屏检查名称与状态；系统减少动效时检查实际动画。", { severity: "Critical" }),
    rule("writing", "内容与无障碍", "操作文案与信息完整性", "用用户认识的对象和动作说明结果。",
      "按钮=动词+对象；错误=原因+恢复路径；空状态=当前情况+下一步。",
      "批量操作写明对象数；删除写明对象和不可恢复后果；数值包含单位与时间范围。",
      "保持相同业务名称；短文案优先，但不能为省空间删除风险说明。",
      "默认、无权限、无数据、无结果、错误、完成。",
      "用 dialog-overlay 等实现术语充当产品文案；只写出错了或确定。",
      "逐项检查按钮和结果动词一致；错误都能回答发生什么、如何处理。", { severity: "Medium" }),
    rule("audit", "验收", "证据、严重度与完成标准", "把规范、实现和验证结果分开记录。",
      "每个发现记录：规则 ID、问题位置、测量值/截图、影响、修复方式、复测结果。",
      "检查正常、窄窗、200% 缩放、键盘流程和失败场景。",
      "检查安全区、键盘遮挡、触控、长内容和任务连续性。",
      "未验证 → 有问题 / 通过 / 不适用；不适用需原因。",
      "没有实测就标记通过；把读取了目录写成复核了全部规则。",
      "Critical 阻断可用性必须修复；High 影响任务效率优先修复；Medium 为一致性；Low 为细节。每条结论必须有证据。",
      { basis: "审核方法参考 apple-design-skill；阈值判定由项目明确", source: method, sourceHeading: "Review process / Working rules" }),
  ];
}

function enterprise(): DesignRule[] {
  const source = "https://github.com/tanglei168/DesignPattern/blob/codex/design-accuracy-shigan-20261027/src/lib/styles/sources/shigan.tokens.json";
  const attachment = { basis: "用户提供的实干家 token 初稿；截图推断项未视为实测", source, sourceHeading: "semantic / component" };
  return [
    rule("enterprise-brand", "视觉基础", "品牌色、在线与风险分离", "同一个黄色承担不同语义时，通过标签与形状消除歧义。",
      "主色 #FFCC00 配黑字；导航 #393847；在线黄点+在线；离线灰点+离线；高风险红色警示、中风险黄色警示、低风险灰色信息。",
      "品牌黄用于主动作和选中强调；风险信息放在内容区；导航选中同时有指示条。",
      "沿用相同语义，状态文本不隐藏；不要只剩颜色圆点。",
      "在线/离线和高/中/低风险是两套独立状态；可同时出现。",
      "把在线直接映射成成功绿；把黄色风险写成普通黄色小字。",
      "让一个在线且高风险的对象同时显示两类状态；灰度查看仍可分辨含义。", attachment),
    rule("enterprise-scale", "视觉基础", "B 端字阶与间距", "支持长时间数据扫描，避免营销页面的大标题和过度留白。",
      "附件字号 10/12/14/16/18/24/28；桌面正文14、页标题18、指标24为本项目角色分配；4px 间距基线；字体 PingFang SC 为推断，须有系统回退。",
      "表格与表单正文14；辅助信息12；重要业务信息不用10；间距优先8/12/16/24。",
      "正文16、辅助14为新增移动建议，尚非附件实测值；页面内边距16；行高随换行增长。",
      "长名称、数字单位、中英文、200% 字号。",
      "把10px作为通用移动正文；将移动建议当作附件原始定义。",
      "检查长设备名和大数值不覆盖单位，正文放大后主要动作仍可见。", attachment),
    rule("enterprise-controls", "组件规范", "B 端控件尺寸与动作层级", "桌面追求密度，移动端保留可操作面积。",
      "桌面按钮/输入高度32px；表格基准行44px；按钮圆角4px、标签2px、卡片8px。移动热区44×44 CSS px为项目适配要求。",
      "查询工具栏并排输入、筛选、查询/重置；新增是主动作，重置是次动作；删除使用危险语义。",
      "筛选入口展开独立面板；主要按钮可全宽；图标本体可以小于44px，实际可点区域不能更小。",
      "默认、hover、按下、键盘焦点、加载、禁用；44px 行高只作基准，不裁剪多行内容。",
      "把32px桌面按钮原样移植到手机；用大热区占位但事件只绑定小图标。",
      "测量实际可点击元素边界；点击图标边缘生效；连续提交不会重复写入。", attachment),
    rule("enterprise-nav", "布局与导航", "工作台与移动任务导航", "桌面管理和移动处理使用同一业务对象，但入口组织不同。",
      "Web：侧栏/当前位置/页面标题/工具栏/数据。移动：页面标题/核心筛选/对象列表/详情/顶层导航。",
      "资产、人员、风险等业务入口常驻；选中项与面包屑一致；侧栏折叠仍可找到入口。",
      "顶层导航只放长期栏目，新增/扫码放操作区；详情返回保留列表位置和条件。",
      "初始、选中、折叠、详情、返回、无权限。",
      "仅隐藏侧栏并加不可点击的底部文字；底部标签执行删除或提交。",
      "逐个导航入口可达；在列表→详情→返回流程检查条件不丢失。"),
    rule("enterprise-table", "组件规范", "资产表格、批量操作与移动详情", "让管理人员比较数据，让现场人员快速定位对象。",
      "对象名称、编号、在线状态、风险、更新时间、行操作；筛选结果数量、选择数量、分页独立。",
      "表头排序；复选框选择；批量操作明确仅本页还是全部结果；危险操作列出数量。",
      "列表保留名称、编号、在线、风险；进入详情看完整字段；批量操作需显式进入选择模式。",
      "初始加载、刷新、无设备、过滤无结果、无权限、请求错误、局部选中、全选。",
      "用同一空白占位代表错误与无数据；过滤后静默保留不可见对象的选择。",
      "更改筛选后检查选择策略；一条和多条操作分别验证；返回时恢复位置。"),
    rule("enterprise-filters", "交互与状态", "筛选与搜索", "用户能理解当前范围并快速清除条件。",
      "关键词、状态、日期、已应用条件、结果数、清空；草稿条件与已应用条件区分。",
      "频繁字段直接展示，其余收起；更改范围后回到首个结果页；请求竞态只保留最新结果。",
      "面板编辑条件，应用后回列表；取消不修改原条件；已应用条件有数量或摘要。",
      "未筛选、编辑草稿、应用中、有结果、无结果、失败。",
      "关闭筛选面板等于自动保存；清空按钮只清文字但保留隐藏条件。",
      "应用两类条件→取消草稿→清空全部；验证查询参数与界面一致。"),
    rule("enterprise-modal", "组件规范", "弹窗、抽屉与底部面板", "根据任务长度选容器，不用同一个白色盒子代表全部弹层。",
      "标题、任务内容、退出入口、主次动作、必要遮罩；可滚动内容与底部动作分离。",
      "短确认用对话框；需要对照列表的编辑用抽屉；复杂长任务进入独立页。",
      "短选项用底部面板；长表单进入独立页；键盘和安全区不遮挡动作。",
      "打开、编辑、校验失败、保存中、保存成功、关闭确认。",
      "多层弹窗堆叠；遮罩关闭导致未保存数据丢失；静态样例宣称已实现焦点管理。",
      "Tab 不逃出模态层，Escape/取消可退出，关闭后返回触发者；未保存退出有明确策略。"),
  ];
}

function apple(): DesignRule[] {
  const ref = (file: string, heading: string) => ({ basis: "Apple HIG 的社区镜像摘编；以官方原文和目标平台版本为准", source: `${appleSource}/references/hig/${file}.md`, sourceHeading: heading });
  return [
    rule("apple-scope", "设计目标", "Apple 平台与 Web 借鉴边界", "熟悉的平台行为比相似的颜色更重要。",
      "区分 iOS/iPadOS/macOS 原生规范、跨框架实现和浏览器风格示意。当前预览为 CSS 示意，不是原生组件。",
      "浏览器不强制拥有 macOS 菜单栏或原生窗口按钮；借鉴可读性、层级、可恢复操作。",
      "iOS 优先系统导航与输入；移动 Web 要自行实现安全区和浏览器返回，不能宣称自动具备系统行为。",
      "框架、平台版本、输入方式和窗口尺寸在评审前明确。",
      "把 macOS、桌面 Web、iOS 混为同一套尺寸规范。",
      "每项平台规则写清原生适用范围；Web 扩展显式标为项目选择。",
      { basis: "apple-design-skill 的适用范围说明", source: method, sourceHeading: "Review process › Step 1 / Scope and limits" }),
    rule("apple-type", "视觉基础", "语义文字样式与动态字号", "文字层级随系统设置保留，不依赖固定比例缩放。",
      "原生端优先系统文字样式与系统字体；小字避免细字重；当前17px和几何字阶仅为画廊近似值。",
      "macOS 与浏览器分别确定文字角色；不能把手机正文字号作为桌面硬性标准。",
      "原生使用 Dynamic Type；Web 使用可缩放字号与弹性容器，标题、标签和正文允许重新排布。",
      "默认、最大辅助字号、粗体偏好、字体回退。",
      "把整个界面缩放替代文字适配；用最小字号充当推荐正文。",
      "放大文字后检查标题层级、列表高度、按钮换行和滚动可达性。", ref("typography", "Ensuring legibility / Conveying hierarchy / Using system fonts")),
    rule("apple-semantic", "视觉基础", "动态颜色与外观", "前景与背景按角色适配，品牌不覆盖状态含义。",
      "区分 label、secondary label、background、grouped background、separator、accent；画廊固定 hex 只是一个外观样例。",
      "Web 用语义 CSS 变量；原生 macOS 使用动态系统色与强调色能力。",
      "亮暗外观分别配对；控制层和丰富内容之间保持可辨识性。",
      "浅色、深色、增加对比、内容滚动到控制层下方。",
      "要求所有主按钮必须蓝色白字；对暗色直接整体反色；把固定蓝值称为系统动态色。",
      "分别检查两套外观的文字、图标、分隔和操作状态；尚无暗色 token 则列为缺口。", ref("color", "Best practices / System colors")),
    rule("apple-layout", "布局与导航", "适配可用空间与安全区", "窗口变化后任务和当前位置保持连续。",
      "重要内容优先；对齐表达关联、缩进表达层级；次要功能渐进披露。",
      "macOS 窗口可调整，重要操作不只放在窗口底部；Web 依据容器空间重排。",
      "尊重安全区；文字变大时并排布局可堆叠；宽屏可显示更多信息，窄屏仍保留访问入口。",
      "窗口调整、横竖屏、分屏、字号变化。",
      "只用设备型号或方向决定布局；因空间变小直接删掉功能。",
      "同一任务在不同空间完成，选中对象、输入和导航路径保持一致。", ref("layout", "Visual hierarchy / Adaptability / Guides and safe areas")),
    rule("apple-buttons", "组件规范", "按钮：外观、内容、角色", "按钮是执行动作的控件，样式必须表达动作优先级。",
      "外观（尺寸/形状/颜色）、内容（文字/图标）、角色（普通/取消/破坏性）分别定义。",
      "系统组件优先；自定义按钮保留按下态、焦点和名称；Web 的热区按本项目设计与可访问性要求验证。",
      "HIG Buttons 给出的通用建议是至少44×44 pt热区；原生 pt 与 CSS px 不混称；图标视觉尺寸不等于热区。",
      "默认、按下、焦点、不可用、等待；指针设备额外检查悬停。",
      "把开关、分段选择和普通动作按钮互换；每个动作都做最高强调。",
      "检查实际热区、动作标签、按下反馈；危险操作不会误用普通主按钮语义。", ref("buttons", "Best practices / Style / Content / Role")),
    rule("apple-lists", "组件规范", "列表与表格：内容、选择与排序", "根据数据与平台选择样式，而不是统一使用卡片。",
      "行、列标题、摘要、选择/导航指示；层级数据考虑大纲视图。",
      "macOS 多列表格按需要支持排序和列宽调整；选中路径持续可辨。",
      "列表行保留简洁摘要；导航指示与查看附加信息的按钮语义不同。",
      "未选、选中、切换、编辑、排序、窄列截断。",
      "以信息按钮代替层级导航；截断后无法分辨对象；所有数据都塞进一个超高行。",
      "排序方向可辨，行选择有反馈；缩窄后仍能识别名称和访问详细内容。", ref("lists-and-tables", "Best practices / Content / Style / Platform considerations")),
    rule("apple-sheets", "组件规范", "Sheet：范围、退出与平台差异", "临时容器只承担与当前上下文相关的有限任务。",
      "内容、取消/关闭、完成、必要时返回；可调尺寸的 sheet 才展示可拖动指示。",
      "macOS sheet 是模态；长时间编辑优先窗口或主内容；Web 需自行实现模态焦点和关闭逻辑。",
      "iOS 可有模态与非模态 sheet；单页取消在顶部前侧、完成在后侧；可调整尺寸时支持拖动指示和相应行为。",
      "打开、调整高度、编辑、未保存关闭、完成、取消。",
      "只提供完成而没有退出路径；堆叠多个 sheet；装饰抓手但不能调整。",
      "取消不保存、完成保存；关闭返回原上下文；长任务不被压进小面板。", ref("sheets", "Anatomy / Best practices / Mobile (iOS, iPadOS)")),
    rule("apple-input", "交互与状态", "触控与精确输入分工", "根据使用环境设计任务密度和操作方式。",
      "手机侧重触控、短时任务与可达区域；Mac 侧重键盘、指针和持续工作。",
      "原生 Mac 支持标准快捷键、菜单与可调整窗口；浏览器不拦截系统或浏览器快捷键。",
      "核心操作在容易触及的位置，限制初始控件数量；辅助操作保持可发现。",
      "单手、键盘、指针、横竖屏、应用切换。",
      "让触控只能依赖右键或 hover；为 Web 仿制不能操作的原生窗口栏。",
      "分别用目标平台主要输入方式完成任务；额外输入方式不造成死路。", { ...ref("designing-for-ios", "Best practices"), basis: "结合 designing-for-ios.md 与 designing-for-macos.md 的平台场景摘编" }),
    rule("apple-access", "内容与无障碍", "可访问性：视觉、运动与认知", "让不同能力的用户完成同一任务。",
      "文字放大、非颜色状态、可访问名称、足够热区、简单手势、替代操作。",
      "支持键盘访问与清晰焦点；读屏顺序跟随内容层级。",
      "手势有按钮替代；支持系统文字和减少动效偏好；重要提示不靠短时自动消失。",
      "文字放大、VoiceOver、减少动态效果、色觉差异、辅助输入。",
      "只测颜色对比就称通过无障碍；将动画或声音作为唯一结果反馈。",
      "至少检查200%文字、键盘、读屏、减少动效和状态文本；记录未覆盖的辅助技术。", { ...ref("accessibility", "Vision / Mobility / Cognitive"), severity: "Critical" }),
  ];
}

export function getDesignSpec(seed: StyleSeed): DesignSpec {
  const detailed = seed.id === "apple-hig" || seed.id === "shigan-b";
  return {
    level: detailed ? "详细规则" : "基础拆解",
    scope: seed.id === "apple-hig"
      ? "收录 Apple Design Skill 审核方法、核心规则摘编与123篇参考目录。目录收录不代表逐篇复核；当前示例不是原生实现。"
      : seed.id === "shigan-b"
        ? "基于实干家附件的 B 端设计方案。附件值、项目补充和待确认项分别标注；下面是要求，不是已验收声明。"
        : "已将当前种子拆成可检查的基础规则；流派构图、官方组件行为与逐条来源尚未完成专项复核，不标作完整规范。",
    rules: [...foundation(seed), ...(seed.id === "shigan-b" ? enterprise() : seed.id === "apple-hig" ? apple() : [])],
  };
}

export function specificationMarkdown(seed: StyleSeed): string {
  const spec = getDesignSpec(seed);
  return [
    `# ${seed.name} · 详细设计规范`,
    `规范层级：${spec.level}。${spec.scope}`,
    "状态：规则已定义；实现与人工验收未在此记录。严禁把本文要求自动判为已通过。",
    `拆解方法参考：[apple-design-skill](${method})，版本 ${appleIndex.revision}。`,
    ...SPEC_SECTIONS.flatMap(section => [
      `## ${section}`,
      ...spec.rules.filter(item => item.section === section).map(item => [
        `### ${item.id} · ${item.title} [${item.severity}]`,
        `目的与场景：${item.purpose}`, `组成与参数：${item.anatomy}`,
        `Web / 桌面：${item.web}`, `移动端：${item.mobile}`,
        `状态：${item.states}`, `禁止：${item.avoid}`, `验收：${item.acceptance}`,
        `依据：${item.basis}${item.source ? `；[${item.sourceHeading ?? "来源"}](${item.source})` : ""}`,
      ].join("\n\n")),
    ]),
    ...(seed.id === "apple-hig" ? ["## Apple 参考目录（仅索引）", ...appleIndex.entries.map(entry => `- ${entry.group} / [${entry.title}](${appleSource}/references/hig/${entry.file})`)] : []),
  ].join("\n\n");
}
