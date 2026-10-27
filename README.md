# 设计范式库 · Design Style Gallery

浏览 Web 与移动端的设计范式。点开一种风格可以看到它的设计说明、组件预览（部分演示支持交互）和三层 design token，并把整套规范下载下来，交给下游的设计或编码代理继续做界面。

## 功能

- 41 种风格，分成平台设计系统、视觉风格、艺术流派、时代潮流和主题配色。
- 按分类、平台（Web / 移动端）、标签和关键词筛选。地址栏会记住 `q`、`cat`、`platform`、`tag`，链接可以直接分享。
- `⌘K` / `Ctrl+K` 打开命令面板，跳到任意风格。
- 详情页包含原则、要做与不要做、Web 与移动端说明、实时预览、色板与对比度、字体阶梯、圆角阴影、组件试样和可搜索的 token 表。
- 预览的风格属性主要由 CSS 变量驱动；设备外框、示例布局仍有固定尺寸，不能视作完整产品复刻。

## 本地运行

```bash
npm install
npm run dev -- -p 43117
```

打开 [http://localhost:43117](http://localhost:43117)。

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## 导出格式

每个风格都可以单独下载，或打成 `<id>-design-kit.zip`：

| 文件 | 作用 |
| --- | --- |
| `design/tokens.css` | 三层 CSS 变量：原始、语义、组件。界面里只引用这些变量。 |
| `design/tokens.json` | W3C Design Tokens Community Group 格式，含 `$value`、`$type`、`$description` 和 `{color.primitive.background}` 这样的别名。 |
| `design/tailwind.theme.css` | Tailwind v4 的 `@theme` 映射，工具类带 `ds-` 前缀，避免覆盖 token 变量名。 |
| `design/DESIGN.md` | 给下游代理的规范：原则、MUST / MUST NOT、token 表、组件配方、Web 与移动端、无障碍和接入步骤。 |
| `.cursor/rules/design-style.mdc` | 压缩版规范，`alwaysApply: true`。 |
| `AGENTS.snippet.md` | 贴进项目 `AGENTS.md` 的短说明。 |

阴影在 DTCG 里尽量拆成标准阴影对象；多阴影、硬偏移和霓虹会同时把 CSS 原文放在 `$extensions` 里，避免丢信息。

## API

```bash
curl -fsSL http://localhost:43117/api/styles
curl -fsSL http://localhost:43117/api/styles/minimalism/DESIGN.md
curl -fsSL http://localhost:43117/api/styles/minimalism/tokens.css
curl -fsSL http://localhost:43117/api/styles/neubrutalism/tokens.json
curl -fsSL http://localhost:43117/api/styles/neubrutalism/tailwind.theme.css
curl -fsSL http://localhost:43117/api/styles/neubrutalism/design-style.mdc
```

`GET /api/styles` 返回索引：id、中英文名、分类、平台、标签、简介，以及上面这些文件的链接。

`GET /api/styles/[id]/[file]` 的 `file` 只能是 `tokens.css`、`tokens.json`、`tailwind.theme.css`、`DESIGN.md`、`design-style.mdc`。未知风格或文件返回 404。这些路径在构建时按全部风格预渲染。

## 如何新增一种风格

1. 在 `src/lib/styles/seeds/` 里选对应分类文件，追加一个 `StyleSeed`。
2. `id` 用小写 kebab-case，并且不要和已有风格重复。
3. 写清楚中文简介、原则、要做与不要做、适用场景，以及 Web / 移动端各自的适配说明。不要用占位文案。
4. 颜色、字体、圆角、阴影、动效和密度都填进种子。字体栈使用 `src/lib/styles/fonts.ts` 里已经加载的家族，并带上系统回退。
5. 不需要手写 token。`buildTokens()` 会从种子生成三层变量；组件 token 只会引用语义 token。
6. 保存后刷新首页。详情页和 `/api/styles/[id]/...` 会跟着 `STYLES` 一起出现。若构建报某个 token 引用了错误的层级，按报错里的变量名改生成器，不要在组件里写死色值。


## 准确度与复核（2026-10-27）

当前共 41 种风格（含实干家 B 端）。本项目是风格启发的组件/token 画廊，不是官方组件库的完整复刻。各风格的结构、色彩对比、未实现特征与验证限制见 [逐项复核报告](docs/accuracy-audit.md)。

- 实干家来源保存在 `src/lib/styles/sources/shigan.tokens.json`；ZIP 中附 `design/source-tokens.json`，DTCG 扩展保留完整原件。实测/推导/待确认的备注不改变。
- DTCG 导出采用 2025.10 值结构；`em` 按种子基础字号转换为 px，原始 CSS 保存在扩展中。DTCG 是社区规范，不是 W3C Recommendation。
- 渐变/纹理需要消费方给容器添加 `style-scope`；实干家移动容器另加 `data-platform="mobile"`，将桌面 32px 控件扩为 44px。
- 字体需要使用方加载；CSS token 不包含字体文件。展示出的对比度不代表整页无障碍通过。

Node 24+ 可运行不依赖第三方包的回归检查：

```bash
npm test
npm run audit
```

完整验收还需联网安装依赖、类型检查、lint、构建及浏览器测试；本次本机环境无法完成这些步骤，详见报告。
