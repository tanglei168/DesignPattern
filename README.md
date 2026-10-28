# 设计范式库 · Design Style Gallery

浏览 Web 与移动端的设计范式。点开一种风格可以看到设计说明、组件预览和三层 design token，并下载整套规范，交给下游的设计或编码代理继续做界面。

当前仓库：[github.com/tanglei168/DesignPattern](https://github.com/tanglei168/DesignPattern)

## 功能

- **120 种风格**：其中 **79** 个来自 [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)（可预览、可导出），其余为本地平台 / 视觉 / 艺术 / 时代 / 主题与实干家 B 端。
- **Pro Max 产品推荐** `/recommend`：按 192 种产品类型交叉推荐风格、配色板与字体配对，并跳转画廊详情。
- **交叉筛选**：产品场景（20 类）× Web / 移动端 × 浅色 / 深色预览 × 设计类型 × 标签 / 关键词。地址栏会记住筛选参数，链接可直接分享。
- **规范库** `/references`：Apple Design Skill 目录索引，以及 UI UX Pro Max 原文规则；风格目录可一键打开对应画廊预览。
- **详情页**：原则、要做与不要做、Web 与移动端说明、实时预览、色板与对比度、字体阶梯、圆角阴影、组件试样、可搜索 token 表，以及详细规范（目标、组成参数、两端差异、状态、禁止事项、验收方法）。
- **导出**：CSS / DTCG JSON / Tailwind v4 `@theme` / `DESIGN.md` / `SPECIFICATION.md` / Cursor 规则 / ZIP 设计包。
- **快捷键**：`⌘K` / `Ctrl+K` 打开命令面板，跳到任意风格。

预览主要由 CSS 变量驱动；设备外框和示例布局仍有固定尺寸，不能视作完整产品复刻。准确度边界见 [docs/accuracy-audit.md](docs/accuracy-audit.md)、[docs/specification-integration.md](docs/specification-integration.md)。

## 环境要求

- Node.js **20+**（开发机当前为 22）
- npm 10+

## 本地启动

```bash
git clone https://github.com/tanglei168/DesignPattern.git
cd DesignPattern
npm install
npm run dev -- -p 43117 -H 127.0.0.1
```

浏览器打开：[http://127.0.0.1:43117](http://127.0.0.1:43117)

说明：

- 默认端口使用 **43117**，避免和常见的 `3000` / `5173` 冲突；需要时可改成任意空闲端口。
- `-H 127.0.0.1` 只监听本机。若要在局域网访问，可改成 `-H 0.0.0.0`。
- 应用壳字体使用本地 `geist` 包，**构建不依赖** Google Fonts 下载。风格预览用的 Google Fonts 是运行时 `<link>`，断网时会回退到系统字体栈。

### 常用脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev -- -p 43117` | 开发服务器 |
| `npm run build` | 生产构建 |
| `npm start -- -p 43117` | 启动已构建产物 |
| `npx tsc --noEmit` | TypeScript 检查 |
| `npm run lint` | ESLint |
| `npm test` | 45 项结构 / 导出 / 筛选回归 |
| `npm run audit` | 打印准确度审计摘要 |

生产模式示例：

```bash
npm run build
npm start -- -p 43117
```

## 导出格式

每个风格都可以单独下载，或打成 `<id>-design-kit.zip`：

| 文件 | 作用 |
| --- | --- |
| `design/tokens.css` | 三层 CSS 变量：原始、语义、组件。界面里只引用这些变量。 |
| `design/tokens.json` | W3C Design Tokens Community Group 格式，含 `$value`、`$type`、`$description` 和别名。 |
| `design/tailwind.theme.css` | Tailwind v4 的 `@theme` 映射，工具类带 `ds-` 前缀。 |
| `design/DESIGN.md` | 给下游代理的规范：原则、MUST / MUST NOT、token 表、组件配方、平台与无障碍说明。 |
| `design/SPECIFICATION.md` | 详细设计规范（目标、参数、两端差异、状态、禁止事项、验收）。 |
| `.cursor/rules/design-style.mdc` | 压缩版规范，`alwaysApply: true`。 |
| `AGENTS.snippet.md` | 贴进项目 `AGENTS.md` 的短说明。 |

阴影在 DTCG 里尽量拆成标准阴影对象；多阴影、硬偏移和霓虹会同时把 CSS 原文放在 `$extensions` 里。

## API

开发服务器启动后：

```bash
curl -fsSL http://127.0.0.1:43117/api/styles
curl -fsSL http://127.0.0.1:43117/api/styles/minimalism/DESIGN.md
curl -fsSL http://127.0.0.1:43117/api/styles/minimalism/SPECIFICATION.md
curl -fsSL http://127.0.0.1:43117/api/styles/minimalism/tokens.css
curl -fsSL http://127.0.0.1:43117/api/styles/neubrutalism/tokens.json
curl -fsSL http://127.0.0.1:43117/api/styles/neubrutalism/tailwind.theme.css
curl -fsSL http://127.0.0.1:43117/api/styles/neubrutalism/design-style.mdc
```

- `GET /api/styles`：索引（id、中英文名、分类、平台、标签、简介、文件链接）。
- `GET /api/styles/[id]/[file]`：`file` 为 `tokens.css`、`tokens.json`、`tailwind.theme.css`、`DESIGN.md`、`SPECIFICATION.md`、`design-style.mdc`。未知风格或文件返回 404。

## 如何新增一种风格

1. 在 `src/lib/styles/seeds/` 里选对应分类文件，追加一个 `StyleSeed`。
2. `id` 用小写 kebab-case，且不要和已有风格重复。
3. 写清楚中文简介、原则、要做与不要做、适用场景，以及 Web / 移动端各自的适配说明。不要用占位文案。
4. 颜色、字体、圆角、阴影、动效和密度都填进种子。字体栈使用 `src/lib/styles/fonts.ts` 里已加载的家族，并带上系统回退。
5. 不需要手写 token。`buildTokens()` 会从种子生成三层变量；组件 token 只会引用语义 token。
6. 如需场景 / 明暗筛选，在种子上补齐 discovery 相关字段（见 `src/lib/styles/discovery.ts`）。
7. 保存后刷新首页。详情页和 `/api/styles/[id]/...` 会跟着 `STYLES` 一起出现。

## 准确度说明

本项目是风格启发与 token 交换画廊，不是官方组件库的完整复刻。结构、对比度、未实现特征与验证限制见：

- [docs/accuracy-audit.md](docs/accuracy-audit.md)
- [docs/specification-integration.md](docs/specification-integration.md)

实干家 B 端来源保存在 `src/lib/styles/sources/shigan.tokens.json`；ZIP 中附 `design/source-tokens.json`。
