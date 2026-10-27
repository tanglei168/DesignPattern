import { contrastRatio, wcagLevel } from "@/lib/color";
import { buildTokens, resolvedValue } from "@/lib/styles/tokens";
import type { StyleSeed } from "@/lib/styles/types";

export function toCursorRule(seed: StyleSeed): string {
  const tokens = buildTokens(seed);
  const valueOf = (cssVar: string) => {
    const token = tokens.all.find((item) => item.cssVar === cssVar);
    return token ? resolvedValue(token, tokens.vars) : "";
  };
  const textContrast = contrastRatio(valueOf("--fg-primary"), valueOf("--bg-canvas"));
  const buttonContrast = contrastRatio(valueOf("--action-primary-fg"), valueOf("--action-primary"));

  return `---
description: 设计风格「${seed.name} / ${seed.nameEn}」的强制视觉规范。实现界面时只能使用 design/tokens.css 中的 token。
alwaysApply: true
---

# ${seed.name} · ${seed.nameEn}

${seed.summary}

完整原则、组件配方和三层 token 表见 \`design/DESIGN.md\`。本规则是必须遵守的压缩版。

## 硬性规则

- 禁止硬编码颜色、圆角、阴影、字号、字重、间距、字体和动效时长。
- 只能使用 \`design/tokens.css\` 的 CSS 变量。组件代码引用组件 token 或语义 token，不直接写原始色值。
- 主按钮最小高度为 \`var(--size-control)\`（当前 ${valueOf("--size-control")}）。
- 焦点必须可见。

## 原则

${seed.principles.map((item) => `- ${item}`).join("\n")}

## MUST

${seed.dos.map((item) => `- ${item}`).join("\n")}

## MUST NOT

${seed.donts.map((item) => `- ${item}`).join("\n")}

## 关键组件 token

- 按钮：\`var(--button-bg)\`、\`var(--button-fg)\`、\`var(--button-bg-hover)\`、\`var(--button-radius)\`、\`var(--button-shadow)\`、\`var(--button-border)\`
- 次按钮与禁用：\`var(--button-secondary-bg)\`、\`var(--button-disabled-bg)\`、\`var(--button-disabled-fg)\`
- 输入框：\`var(--input-bg)\`、\`var(--input-fg)\`、\`var(--input-border)\`、\`var(--input-radius)\`、\`var(--input-height)\`、\`var(--input-focus)\`
- 卡片：\`var(--card-bg)\`、\`var(--card-radius)\`、\`var(--card-shadow)\`、\`var(--card-padding)\`、\`var(--card-blur)\`
- 徽章：\`var(--badge-bg)\`、\`var(--badge-fg)\`、\`var(--badge-radius)\`
- 导航：\`var(--nav-bg)\`、\`var(--nav-fg)\`、\`var(--nav-active)\`
- 底部标签栏：\`var(--tabbar-bg)\`、\`var(--tabbar-fg)\`、\`var(--tabbar-active)\`、\`var(--tabbar-height)\`
- 列表：\`var(--list-fg)\`、\`var(--list-muted)\`、\`var(--list-divider)\`
- 对话框：\`var(--dialog-bg)\`、\`var(--dialog-overlay)\`、\`var(--dialog-radius)\`、\`var(--dialog-shadow)\`

## 平台

### Web

${seed.platformNotes.web}

小于 768px 按移动端；1024px 及以上才使用侧栏。悬停不能是唯一操作方式。

### 移动端

${seed.platformNotes.mobile}

底部标签栏使用 tabbar token，并加 \`env(safe-area-inset-bottom)\`。顶部留出 \`env(safe-area-inset-top)\`。

## 无障碍

正文对比 ${formatRatio(textContrast)}（${wcagLevel(textContrast)}），主按钮对比 ${formatRatio(buttonContrast)}（${wcagLevel(buttonContrast)}）。不够时调整语义配色；低于 3:1 不能靠放大字号达标，大字 AA 要求至少 3:1 且 24 CSS px 或粗体约 18.67 CSS px。状态同时用文字或图标。\`prefers-reduced-motion\` 时把时长 token 视为 0ms。
`;
}

export function toAgentsSnippet(seed: StyleSeed): string {
  return `# 设计风格接入片段

把下面这段合并进仓库根目录的 \`AGENTS.md\`：

本项目界面遵循「${seed.name}」（${seed.nameEn}）。

- 详细规则、平台差异与验收方法见 \`design/SPECIFICATION.md\`，规则定义不代表已实现或已验收。
- 改 UI 之前先阅读 \`design/DESIGN.md\`。
- 全局引入 \`design/tokens.css\`。颜色、圆角、阴影、字号、字重和间距只能使用其中的 CSS 变量，禁止硬编码。
- 遵守 DESIGN.md 的 MUST 与 MUST NOT。
- Web 与移动端分别处理触控热区、底部标签栏、安全区和断点。
- 可选规则文件：\`.cursor/rules/design-style.mdc\`（\`alwaysApply: true\`）。
`;
}

function formatRatio(ratio: number | null): string {
  if (ratio === null) return "无法计算";
  return `${ratio.toFixed(2)}:1`;
}

