# 规范与分类接入说明

## 浏览入口

- 首页：产品场景（20类）、适用平台（Web/移动端）、预览外观（浅色/深色）、设计类型和标签交叉筛选。URL 保留筛选参数。
- 风格详情：详细规范分为设计目标、视觉基础、布局导航、组件、交互状态、内容与无障碍、验收。每条包含场景、组成参数、两端差异、状态、禁止事项、验收、严重度和依据。
- `/references`：外部规范目录与原文规则检索，和本地可预览风格分开。
- `SPECIFICATION.md`：单独下载、API 和 ZIP 均可获取；`DESIGN.md` 内含同源规则。

## 来源与范围

### Apple Design Skill

- https://github.com/dickwu/apple-design-skill
- 版本：`914b6a377c22755597e4405e54911b996de822d7`；检索日期 2026-10-27。
- 参考审核方法和核心页面：accessibility、layout、typography、color、buttons、sheets、lists-and-tables、designing-for-ios、designing-for-macos、cross-platform。
- 123 篇目录只保存标题、文件名、分组与链接，不批量复制 Apple 文档。目录中的更新时间是镜像记录，不是本项目独立核验的时间。
- Apple HIG 本地条目包含21条规则（12条基础拆解+9条专项）；CSS 预览不等于原生实现。

### UI UX Pro Max

- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- 检索时版本：`28b3b8dee8c976df4fa3e94aed4e092ad43fcb03`；日期 2026-10-27。
- MIT，保留 `src/lib/styles/sources/ui-ux-pro-max/LICENSE`。
- 导入 `styles.csv`、`ux-guidelines.csv`、`app-interface.csv`、`colors.csv`、`typography.csv`、`products.csv`、`ui-reasoning.csv`；`catalog.json` / `recommend.json` / `promax.generated.json` 为投影。
- **79 个非废弃风格已映射为画廊可预览条目**（id 前缀 `pm-`，分类「UI UX Pro Max」），可导出 token / DESIGN.md。
- `/recommend` 按 192 种产品类型交叉推荐风格、配色与字体配对（基于 products/colors/typography，不是完整上游 CLI 推荐引擎）。
- 119 条 UX 规则 + 32 条 App 规则仍在 `/references` 原文检索；各技术栈 CSV 尚未逐栈接入。
- 映射色板与阴影来自上游文字描述/色板启发式，不等同官方组件库像素复刻；落地前仍需平台与无障碍验收。

## 项目自己的决策

- 场景标签按用户截图（SaaS、教育、宠物、AI、电商等20类）设置，具体风格适配关系由本项目编辑判断，不冒充上游推荐引擎结果。
- 明暗筛选表示当前种子预览的外观，不代表每个风格已具备完整的双模式 token。
- B端19条规则（12条基础+7条专项）；附件数值、推断字体、移动补充建议均有边界说明。
- 其余39种风格是12条基础拆解，尚未完成逐风格官方/历史构图审查。
- 所有规范默认“实现待验收”。单元测试验证结构、筛选和导出，不证明交互、视觉或无障碍全通过。

## 验证

- TypeScript 类型检查、45项测试、修改模块 ESLint。
- 浏览器检查首页组合筛选、规范库加载和移动规则检索；390px宽度检查规范库布局。
- 不包含所有风格、所有辅助技术与原生端的完整验收。
- 应用壳字体已改为本地 `geist` 包（`next/font/local`），生产构建不再依赖 Google Fonts 下载 Geist。风格预览用的 Google Fonts 仍为运行时 `<link>`，断网时回退到系统字体栈。
