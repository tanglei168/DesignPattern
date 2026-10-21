import { markdownCell, tokenTable } from "@/lib/export/format";
import { contrastRatio, wcagLevel } from "@/lib/color";
import { getCategory } from "@/lib/styles/categories";
import { buildTokens, resolvedValue } from "@/lib/styles/tokens";
import type { StyleSeed } from "@/lib/styles/types";

const DENSITY_LABEL = {
  compact: "紧凑",
  comfortable: "舒适",
  spacious: "宽松",
} as const;

export function toAgentMarkdown(seed: StyleSeed): string {
  const category = getCategory(seed.category);
  const tokens = buildTokens(seed);
  const valueOf = (cssVar: string) => {
    const token = tokens.all.find((item) => item.cssVar === cssVar);
    return token ? resolvedValue(token, tokens.vars) : "";
  };
  const canvas = valueOf("--bg-canvas");
  const foreground = valueOf("--fg-primary");
  const primary = valueOf("--action-primary");
  const primaryFg = valueOf("--action-primary-fg");
  const textContrast = contrastRatio(foreground, canvas);
  const buttonContrast = contrastRatio(primaryFg, primary);

  return `# ${seed.name} · ${seed.nameEn}

${seed.summary}

| | |
| --- | --- |
| id | \`${seed.id}\` |
| 分类 | ${category.name} / ${category.nameEn} |
| 平台 | ${seed.platforms.map(platformLabel).join("、")} |
| 密度 | ${DENSITY_LABEL[seed.density]} |
| 标签 | ${seed.tags.join("、")} |

## 设计原则

${seed.principles.map((item) => `- ${item}`).join("\n")}

## 硬性规则

实现界面时遵守下面的 MUST / MUST NOT。色值、圆角、阴影、字号、字重和间距如果写死，这个风格就会失效。

### MUST

${seed.dos.map((item) => `- ${item}`).join("\n")}
- 只能使用 \`design/tokens.css\` 中的自定义属性。颜色、圆角、阴影、字号、字重、间距、字体和动效时长都走 token。
- 组件优先使用第三层组件 token（\`--button-*\`、\`--input-*\`、\`--card-*\`），其次使用语义 token，最后才是原始 token。
- 主按钮最小高度使用 \`var(--size-control)\`，当前为 ${valueOf("--size-control")}。
- 焦点态必须可见，使用 \`var(--input-focus)\` 或 \`var(--action-primary)\` 画出焦点环。

### MUST NOT

${seed.donts.map((item) => `- ${item}`).join("\n")}
- 禁止硬编码颜色、圆角、阴影、字号、字重和间距，包括看起来“只是一个像素”的例外。
- 禁止在组件里直接引用原始色值；组件样式只能引用语义 token。
- 禁止用透明度单独降低对比来伪造禁用态，使用 \`var(--button-disabled-bg)\` 和 \`var(--button-disabled-fg)\`。
- 禁止把只在悬停时出现的信息当作移动端的唯一入口。

## 适用场景

${seed.useCases.map((item) => `- ${item}`).join("\n")}

## Token

当前值只是这份种子的解析结果，写代码时仍然引用变量名。

### 01 原始 Primitive

${tokenTable(tokens.primitive)}

### 02 语义 Semantic

${tokenTable(tokens.semantic)}

### 03 组件 Component

${tokenTable(tokens.component)}

## 组件配方

### 按钮

- 主按钮：背景 \`var(--button-bg)\`（当前 ${inline(valueOf("--button-bg"))}），文字 \`var(--button-fg)\`，圆角 \`var(--button-radius)\`，描边 \`var(--button-border-width)\` solid \`var(--button-border)\`，阴影 \`var(--button-shadow)\`，内边距 \`var(--button-padding-y)\` \`var(--button-padding-x)\`，字号 \`var(--button-size)\`，字重 \`var(--button-weight)\`，字体 \`var(--button-font)\`。
- 悬停或按下时，背景切换为 \`var(--button-bg-hover)\`。移动端用按下态，不要只做悬停。
- 次按钮：\`var(--button-secondary-bg)\`、\`var(--button-secondary-fg)\`、\`var(--button-secondary-border)\`。
- 禁用：\`var(--button-disabled-bg)\`、\`var(--button-disabled-fg)\`，移除指针并设置 \`aria-disabled\`。

### 输入框

- 高度 \`var(--input-height)\`，背景 \`var(--input-bg)\`，文字 \`var(--input-fg)\`，占位 \`var(--input-placeholder)\`。
- 圆角 \`var(--input-radius)\`，描边 \`var(--input-border-width)\` solid \`var(--input-border)\`，水平内边距 \`var(--input-padding-x)\`。
- 聚焦时用 \`var(--input-focus)\` 画 2px 焦点环，不要只改变边框颜色却让键盘用户看不见。

### 卡片

- 背景 \`var(--card-bg)\`，文字 \`var(--card-fg)\`，次要文字 \`var(--card-muted)\`。
- 圆角 \`var(--card-radius)\`，描边 \`var(--card-border-width)\` solid \`var(--card-border)\`，阴影 \`var(--card-shadow)\`，内边距 \`var(--card-padding)\`。
- 若 \`var(--card-blur)\` 不是 \`0px\`，加上 \`backdrop-filter: blur(var(--card-blur))\`。当前模糊为 ${inline(valueOf("--card-blur"))}。

### 徽章

- 背景 \`var(--badge-bg)\`，文字 \`var(--badge-fg)\`，圆角 \`var(--badge-radius)\`，字号 \`var(--badge-size)\`。
- 徽章只标记状态或分类，不拿来代替按钮。

### 导航与底部标签栏

- 顶部导航：背景 \`var(--nav-bg)\`，文字 \`var(--nav-fg)\`，弱项 \`var(--nav-muted)\`，当前项 \`var(--nav-active)\`，高度 \`var(--nav-height)\`，底边 \`var(--nav-border)\`。
- 移动端底部标签栏：背景 \`var(--tabbar-bg)\`，未选中 \`var(--tabbar-fg)\`，选中 \`var(--tabbar-active)\`，高度 \`var(--tabbar-height)\`，顶边 \`var(--tabbar-border)\`。
- 标签不超过 5 个，每项同时有图标和短文字。

### 列表

- 行背景 \`var(--list-bg)\`，主文字 \`var(--list-fg)\`，辅助文字 \`var(--list-muted)\`。
- 分割线 \`var(--list-border-width)\` solid \`var(--list-divider)\`。
- 垂直内边距 \`var(--list-padding-y)\`，并保证整行可点区域不小于 \`var(--size-control)\`。

### 对话框

- 遮罩 \`var(--dialog-overlay)\`，面板背景 \`var(--dialog-bg)\`，文字 \`var(--dialog-fg)\`，说明 \`var(--dialog-muted)\`。
- 圆角 \`var(--dialog-radius)\`，阴影 \`var(--dialog-shadow)\`，内边距 \`var(--dialog-padding)\`，描边 \`var(--dialog-border)\`。
- 标题使用 \`var(--font-heading)\` 和 \`var(--text-title)\`。关闭按钮使用同样的最小热区。

## Web 与移动端

### Web

${seed.platformNotes.web}

- 断点：宽度小于 768px 时按移动端布局；768px 到 1023px 为平板，内容单列或双列；1024px 及以上可以使用侧栏。
- 悬停只增强已有信息，不作为唯一操作方式。

### 移动端

${seed.platformNotes.mobile}

- 可点击目标不小于 \`var(--size-control)\`（当前 ${valueOf("--size-control")}；只要风格包含移动端，这个值至少是 44px）。
- 使用底部标签栏，而不是把桌面侧栏原样缩小。
- 固定在底部的按钮和标签栏要加上 \`padding-bottom: env(safe-area-inset-bottom)\`。
- 标题避开刘海：顶部留出 \`env(safe-area-inset-top)\`。
- 输入聚焦后保证字段仍在可视区域，不要让键盘挡住错误信息。

## 无障碍

- 正文色在画布上的对比度为 ${formatRatio(textContrast)}（${wcagLabel(textContrast)}）。
- 主按钮文字在主按钮填充上的对比度为 ${formatRatio(buttonContrast)}（${wcagLabel(buttonContrast)}）。
- 低于 AA（正文 4.5:1，大字号 3:1）时，不要另写一个色值来“修好”。改用对比更高的语义 token，或把该处字号升到 \`var(--text-title)\` 以上并加粗。
- 状态不能只靠颜色。成功、警告、危险同时使用文字或图标。
- 尊重 \`prefers-reduced-motion\`：把 \`var(--duration-interaction)\` 和 \`var(--duration-panel)\` 降为 \`0ms\`。

## 如何在项目中使用

1. 将本文件放到 \`design/DESIGN.md\`，将同目录的 \`tokens.css\`、\`tokens.json\`、\`tailwind.theme.css\` 放在 \`design/\`。
2. 在应用入口引入 \`design/tokens.css\`。所有界面颜色、圆角、阴影和字号都引用其中的变量。
3. 在 \`AGENTS.md\` 加入 \`AGENTS.snippet.md\` 的说明，或把 \`.cursor/rules/design-style.mdc\` 放到 \`.cursor/rules/\`，并保持 \`alwaysApply: true\`。
4. 下游设计或编码代理开始改 UI 之前，先读 \`design/DESIGN.md\`，再按组件配方使用 token。
5. 若项目使用 Tailwind v4，在 \`tokens.css\` 之后引入 \`tailwind.theme.css\`，使用 \`bg-ds-canvas\`、\`text-ds-fg\`、\`rounded-ds-control\` 这类 \`ds-\` 工具类。不要让 Tailwind 主题变量覆盖 \`--color-*\` 或 \`--font-body\` 这些 token 名。
6. \`tokens.json\` 是 W3C Design Tokens Community Group 格式，\`$value\` 里的 \`{color.primitive.background}\` 这种别名指向原始 token。阴影保留了 CSS 原文在 \`$extensions\` 中，方便多阴影、硬偏移和霓虹光晕原样落地。
`;
}

export function toAgentPrompt(seed: StyleSeed): string {
  return `请按「${seed.name}」（${seed.nameEn}）实现界面。先阅读 design/DESIGN.md，并引入 design/tokens.css。颜色、圆角、阴影、字号、字重、间距只能使用 tokens.css 里的 CSS 变量，禁止硬编码。遵守 DESIGN.md 中的 MUST 与 MUST NOT。Web 与移动端分别处理触控热区、底部标签栏、安全区和断点。`;
}

function platformLabel(platform: StyleSeed["platforms"][number]): string {
  return platform === "web" ? "Web" : "移动端";
}

function inline(value: string): string {
  return markdownCell(value);
}

function formatRatio(ratio: number | null): string {
  if (ratio === null) return "无法计算";
  return `${ratio.toFixed(2)}:1`;
}

function wcagLabel(ratio: number | null): string {
  const level = wcagLevel(ratio);
  if (level === "Fail") return "未达到 AA";
  if (level === "AA Large") return "仅达到大字号 AA";
  return `达到 ${level}`;
}
