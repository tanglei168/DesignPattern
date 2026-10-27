import { applyShigan } from "@/lib/styles/shigan";
import { contrastRatio, hoverColor, mixColors, readableOn, withAlpha } from "@/lib/color";
import type { DesignToken, StyleSeed, TokenSet, TokenTier, TokenType } from "@/lib/styles/types";

type Draft = {
  cssVar: string;
  value: string;
  type: TokenType;
  description: string;
  cssProperty: string;
  tier: TokenTier;
  group: string;
  path: string[];
  ref?: string;
};

const TIER_RANK: Record<TokenTier, number> = {
  primitive: 0,
  semantic: 1,
  component: 2,
};

export function buildTokens(seed: StyleSeed): TokenSet {
  const drafts = [...primitives(seed), ...semantics(seed), ...components()];
  if (seed.id === "shigan-b") applyShigan(drafts);
  const byVar = new Map(drafts.map((token) => [token.cssVar, token]));
  const all: DesignToken[] = drafts.map((token) => {
    if (token.ref) {
      const target = byVar.get(token.ref);
      if (!target) {
        throw new Error(`${seed.id}: ${token.cssVar} references missing ${token.ref}`);
      }
      if (TIER_RANK[target.tier] !== TIER_RANK[token.tier] - 1) {
        throw new Error(
          `${seed.id}: ${token.cssVar} must reference the previous tier, not ${target.cssVar}`,
        );
      }
    }
    return {
      name: token.cssVar,
      cssVar: token.cssVar,
      value: token.ref ? `var(${token.ref})` : token.value,
      alias: token.ref ? `{${byVar.get(token.ref)!.path.join(".")}}` : undefined,
      ref: token.ref,
      type: token.type,
      description: token.description,
      cssProperty: token.cssProperty,
      tier: token.tier,
      group: token.group,
      path: token.path,
    };
  });

  const vars = Object.fromEntries(all.map((token) => [token.cssVar, token.value]));
  return {
    primitive: all.filter((token) => token.tier === "primitive"),
    semantic: all.filter((token) => token.tier === "semantic"),
    component: all.filter((token) => token.tier === "component"),
    all,
    vars,
  };
}

export function resolvedValue(token: DesignToken, vars: Record<string, string>): string {
  let current = vars[token.cssVar] ?? token.value;
  for (let hop = 0; hop < 8; hop += 1) {
    const match = current.match(/^var\((--[\w-]+)\)$/);
    if (!match) return current;
    const next = vars[match[1]];
    if (!next) return current;
    current = next;
  }
  return current;
}

export function contrastPair(foreground: string, background: string): number | null {
  return contrastRatio(foreground, background);
}

function primitives(seed: StyleSeed): Draft[] {
  const colors = seed.colors;
  const hover = hoverColor(colors.primary, colors.background);
  const onAccent = readableOn(colors.accent, colors.background);
  const disabled = mixColors(colors.surface, colors.muted, 0.28);
  const disabledFg = mixColors(colors.foreground, colors.surface, 0.55);
  const overlay = withAlpha(colors.foreground, 0.48);
  const sizes = typeScale(seed.typography.baseSize, seed.typography.scaleRatio);
  const spaces = spaceScale(seed.density);
  const control = controlSize(seed);
  const tabbar = seed.density === "spacious" ? "64px" : "56px";
  const hairline = Number.parseFloat(seed.shape.borderWidth) >= 2 ? seed.shape.borderWidth : "1px";

  const color = (
    slug: string,
    cssVar: string,
    value: string,
    description: string,
  ): Draft => ({
    cssVar,
    value,
    type: "color",
    description,
    cssProperty: "color",
    tier: "primitive",
    group: "色彩",
    path: ["color", "primitive", slug],
  });

  return [
    color("background", "--color-background", colors.background, "页面最底层的原始画布色。"),
    color("surface", "--color-surface", colors.surface, "卡片、输入框和导航使用的表面色。"),
    color("surface-alt", "--color-surface-alt", colors.surfaceAlt, "次级表面，用于分区和按下态。"),
    color("foreground", "--color-foreground", colors.foreground, "主要文字与图标色。"),
    color("muted", "--color-muted", colors.muted, "次要说明文字色。"),
    color("border", "--color-border", colors.border, "描边、分割线和控件边界。"),
    color("primary", "--color-primary", colors.primary, "主行动色。"),
    color("primary-foreground", "--color-primary-foreground", colors.primaryForeground, "放在主行动色上的文字。"),
    color("primary-hover", "--color-primary-hover", hover, "主行动色的悬停态，由主色混合黑或白得到。"),
    color("secondary", "--color-secondary", colors.secondary, "次按钮和弱强调表面。"),
    color("accent", "--color-accent", colors.accent, "点缀色，用于徽章和少量高亮。"),
    color("on-secondary", "--color-on-secondary", readableOn(colors.secondary, colors.background), "次行动表面上的可读文字。"),
    color("on-accent", "--color-on-accent", onAccent, "在点缀色上对比合格的文字色。"),
    color("success", "--color-success", colors.success, "成功状态。"),
    color("warning", "--color-warning", colors.warning, "警告状态。"),
    color("danger", "--color-danger", colors.danger, "危险和破坏性操作。"),
    color("disabled", "--color-disabled", disabled, "禁用表面，由表面色与弱文字色混合。"),
    color("disabled-foreground", "--color-disabled-foreground", disabledFg, "禁用文字。"),
    color("overlay", "--color-overlay", overlay, "对话框遮罩。"),
    font("sans", "--font-sans", seed.typography.sans, "界面正文字体族。"),
    font("display", "--font-display", seed.typography.display, "标题和展示字体族。"),
    font("mono", "--font-mono", seed.typography.mono, "代码与等宽数字字体族。"),
    weight("weight-heading", "--weight-heading", seed.typography.headingWeight, "标题字重。"),
    weight("weight-body", "--weight-body", seed.typography.bodyWeight, "正文字重。"),
    dimension("letter-spacing", "--tracking-base", seed.typography.letterSpacing, "字体", "letter-spacing", "基础字距。", ["font", "primitive", "letter-spacing"]),
    number("--scale-ratio", String(seed.typography.scaleRatio), "字号倍率，字号阶梯由 baseSize 连乘得到。", ["font", "primitive", "scale-ratio"], "字体"),
    ...Object.entries(sizes).map(([step, value]) =>
      dimension(step, `--size-${step}`, value, "字号", "font-size", `字号 ${step}，由 ${seed.typography.baseSize}px × ${seed.typography.scaleRatio} 推出。`, ["size", "primitive", step]),
    ),
    dimension("control", "--size-control-base", control, "字号", "height", seed.platforms.includes("mobile") ? "控件高度，移动端至少 44px。" : "控件高度。", ["size", "primitive", "control"]),
    dimension("tabbar", "--size-tabbar-base", tabbar, "字号", "height", "底部标签栏高度，含图标与文字。", ["size", "primitive", "tabbar"]),
    ...spaces.map((space) =>
      dimension(String(space.step), `--space-${space.step}`, space.value, "间距", "gap", `${seed.density} 密度下的 ${space.step} 级间距。`, ["space", "primitive", String(space.step)]),
    ),
    dimension("sm", "--radius-sm", seed.shape.radiusSm, "圆角与边框", "border-radius", "小圆角，用于徽章内芯或紧凑控件。", ["radius", "primitive", "sm"]),
    dimension("md", "--radius-md", seed.shape.radiusMd, "圆角与边框", "border-radius", "默认控件圆角。", ["radius", "primitive", "md"]),
    dimension("lg", "--radius-lg", seed.shape.radiusLg, "圆角与边框", "border-radius", "卡片和弹层圆角。", ["radius", "primitive", "lg"]),
    dimension("full", "--radius-full", seed.shape.radiusFull, "圆角与边框", "border-radius", "胶囊或圆形。直角流派这里也会是 0。", ["radius", "primitive", "full"]),
    dimension("width", "--border-width", seed.shape.borderWidth, "圆角与边框", "border-width", "控件描边粗细。", ["border", "primitive", "width"]),
    dimension("hairline", "--border-width-hairline", hairline, "圆角与边框", "border-width", "分割线粗细。粗描边风格会同步加粗。", ["border", "primitive", "hairline"]),
    shadow("sm", "--shadow-sm", seed.elevation.shadowSm, "轻阴影，按钮和缩略图使用。"),
    shadow("md", "--shadow-md", seed.elevation.shadowMd, "抬起阴影，卡片使用。"),
    shadow("lg", "--shadow-lg", seed.elevation.shadowLg, "覆盖层阴影，对话框使用。"),
    duration("duration-fast", "--duration-fast", seed.motion.durationFast, "悬停和按压反馈时长。"),
    duration("duration-base", "--duration-base", seed.motion.durationBase, "面板和页面转场时长。"),
    easing("--ease-standard", seed.motion.easing, "标准缓动曲线。"),
    dimension("blur", "--effect-blur", seed.effects?.backdropBlur ?? "0px", "效果", "backdrop-filter", "表面背后的模糊半径。不需要模糊时为 0。", ["effect", "primitive", "blur"]),
    number("--opacity-surface", String(seed.effects?.surfaceOpacity ?? 1), "表面不透明度。小于 1 表示玻璃或叠色。", ["effect", "primitive", "surface-opacity"], "效果"),
  ];
}

function semantics(seed: StyleSeed): Draft[] {
  const space = semanticSpacing(seed.density);
  const color = (slug: string, cssVar: string, ref: string, description: string, cssProperty = "color") =>
    alias(cssVar, ref, "color", description, cssProperty, "semantic", "背景与文字", ["color", "semantic", slug]);
  const action = (slug: string, cssVar: string, ref: string, description: string) =>
    alias(cssVar, ref, "color", description, "background-color", "semantic", "动作与状态", ["color", "semantic", slug]);

  return [
    color("bg-canvas", "--bg-canvas", "--color-background", "页面画布。", "background-color"),
    color("bg-surface", "--bg-surface", "--color-surface", "默认表面。", "background-color"),
    color("bg-surface-alt", "--bg-surface-alt", "--color-surface-alt", "次级表面。", "background-color"),
    color("fg-primary", "--fg-primary", "--color-foreground", "主要文字。"),
    color("fg-muted", "--fg-muted", "--color-muted", "次要文字。"),
    color("fg-on-primary", "--fg-on-primary", "--color-primary-foreground", "主色上的文字。"),
    color("fg-on-secondary", "--fg-on-secondary", "--color-on-secondary", "次行动表面上的文字。"),
    color("fg-on-accent", "--fg-on-accent", "--color-on-accent", "点缀色上的文字。"),
    color("border-default", "--border-default", "--color-border", "默认边界。", "border-color"),
    action("action-primary", "--action-primary", "--color-primary", "主行动填充。"),
    action("action-primary-hover", "--action-primary-hover", "--color-primary-hover", "主行动悬停。"),
    action("action-primary-fg", "--action-primary-fg", "--color-primary-foreground", "主行动文字。"),
    action("action-secondary", "--action-secondary", "--color-secondary", "次行动填充。"),
    action("action-accent", "--action-accent", "--color-accent", "点缀填充。"),
    action("state-success", "--state-success", "--color-success", "成功。"),
    action("state-warning", "--state-warning", "--color-warning", "警告。"),
    action("state-danger", "--state-danger", "--color-danger", "危险。"),
    action("state-disabled", "--state-disabled", "--color-disabled", "禁用表面。"),
    action("state-disabled-fg", "--state-disabled-fg", "--color-disabled-foreground", "禁用文字。"),
    action("overlay", "--overlay", "--color-overlay", "模态遮罩。"),
    alias("--radius-tight", "--radius-sm", "dimension", "紧凑圆角。", "border-radius", "semantic", "尺度", ["radius", "semantic", "tight"]),
    alias("--radius-control", "--radius-md", "dimension", "控件圆角。", "border-radius", "semantic", "尺度", ["radius", "semantic", "control"]),
    alias("--radius-surface", "--radius-lg", "dimension", "表面圆角。", "border-radius", "semantic", "尺度", ["radius", "semantic", "surface"]),
    alias("--radius-pill", "--radius-full", "dimension", "胶囊圆角。", "border-radius", "semantic", "尺度", ["radius", "semantic", "pill"]),
    alias("--shadow-subtle", "--shadow-sm", "shadow", "轻抬起。", "box-shadow", "semantic", "尺度", ["shadow", "semantic", "subtle"]),
    alias("--shadow-raised", "--shadow-md", "shadow", "卡片抬起。", "box-shadow", "semantic", "尺度", ["shadow", "semantic", "raised"]),
    alias("--shadow-overlay", "--shadow-lg", "shadow", "弹层抬起。", "box-shadow", "semantic", "尺度", ["shadow", "semantic", "overlay"]),
    alias("--space-inline", space.inline, "dimension", "行内间隙。", "gap", "semantic", "尺度", ["space", "semantic", "inline"]),
    alias("--space-stack", space.stack, "dimension", "纵向堆叠间距。", "gap", "semantic", "尺度", ["space", "semantic", "stack"]),
    alias("--space-container", space.container, "dimension", "容器内边距。", "padding", "semantic", "尺度", ["space", "semantic", "container"]),
    alias("--space-control-x", space.controlX, "dimension", "控件水平内边距。", "padding-inline", "semantic", "尺度", ["space", "semantic", "control-x"]),
    alias("--space-control-y", space.controlY, "dimension", "控件垂直内边距。", "padding-block", "semantic", "尺度", ["space", "semantic", "control-y"]),
    alias("--size-control", "--size-control-base", "dimension", "可点击控件的最小高度。", "height", "semantic", "尺度", ["size", "semantic", "control"]),
    alias("--size-tabbar", "--size-tabbar-base", "dimension", "底部标签栏高度。", "height", "semantic", "尺度", ["size", "semantic", "tabbar"]),
    alias("--font-body", "--font-sans", "fontFamily", "正文与控件字体。", "font-family", "semantic", "字体语义", ["font", "semantic", "body"]),
    alias("--font-heading", "--font-display", "fontFamily", "标题字体。", "font-family", "semantic", "字体语义", ["font", "semantic", "heading"]),
    alias("--font-code", "--font-mono", "fontFamily", "代码字体。", "font-family", "semantic", "字体语义", ["font", "semantic", "code"]),
    alias("--text-caption", "--size-sm", "dimension", "说明文字字号。", "font-size", "semantic", "字体语义", ["font", "semantic", "caption"]),
    alias("--text-body", "--size-base", "dimension", "正文字号。", "font-size", "semantic", "字体语义", ["font", "semantic", "body-size"]),
    alias("--text-title", "--size-2xl", "dimension", "栏目标题字号。", "font-size", "semantic", "字体语义", ["font", "semantic", "title"]),
    alias("--text-display", "--size-4xl", "dimension", "展示标题字号。", "font-size", "semantic", "字体语义", ["font", "semantic", "display"]),
    alias("--weight-emphasis", "--weight-heading", "fontWeight", "强调字重。", "font-weight", "semantic", "字体语义", ["font", "semantic", "weight-emphasis"]),
    alias("--weight-regular", "--weight-body", "fontWeight", "常规字重。", "font-weight", "semantic", "字体语义", ["font", "semantic", "weight-regular"]),
    alias("--tracking-body", "--tracking-base", "dimension", "正文字距。", "letter-spacing", "semantic", "字体语义", ["font", "semantic", "tracking"]),
    alias("--duration-interaction", "--duration-fast", "duration", "交互反馈时长。", "transition-duration", "semantic", "动效", ["motion", "semantic", "interaction"]),
    alias("--duration-panel", "--duration-base", "duration", "面板动效时长。", "transition-duration", "semantic", "动效", ["motion", "semantic", "panel"]),
    alias("--ease-interaction", "--ease-standard", "cubicBezier", "交互缓动。", "transition-timing-function", "semantic", "动效", ["motion", "semantic", "easing"]),
    alias("--border-width-control", "--border-width", "dimension", "控件描边。", "border-width", "semantic", "尺度", ["border", "semantic", "control"]),
    alias("--border-width-divider", "--border-width-hairline", "dimension", "分割线。", "border-width", "semantic", "尺度", ["border", "semantic", "divider"]),
    alias("--effect-blur-use", "--effect-blur", "dimension", "可用的背景模糊。", "backdrop-filter", "semantic", "尺度", ["effect", "semantic", "blur"]),
  ];
}

function components(): Draft[] {
  const button = (slug: string, cssVar: string, ref: string, type: TokenType, description: string, cssProperty: string) =>
    alias(cssVar, ref, type, description, cssProperty, "component", "按钮", ["component", "button", slug]);
  const input = (slug: string, cssVar: string, ref: string, type: TokenType, description: string, cssProperty: string) =>
    alias(cssVar, ref, type, description, cssProperty, "component", "输入框", ["component", "input", slug]);
  const card = (slug: string, cssVar: string, ref: string, type: TokenType, description: string, cssProperty: string) =>
    alias(cssVar, ref, type, description, cssProperty, "component", "卡片", ["component", "card", slug]);
  const badge = (slug: string, cssVar: string, ref: string, type: TokenType, description: string, cssProperty: string) =>
    alias(cssVar, ref, type, description, cssProperty, "component", "徽章", ["component", "badge", slug]);
  const nav = (slug: string, cssVar: string, ref: string, type: TokenType, description: string, cssProperty: string) =>
    alias(cssVar, ref, type, description, cssProperty, "component", "导航", ["component", "nav", slug]);
  const tabbar = (slug: string, cssVar: string, ref: string, type: TokenType, description: string, cssProperty: string) =>
    alias(cssVar, ref, type, description, cssProperty, "component", "标签栏", ["component", "tabbar", slug]);
  const list = (slug: string, cssVar: string, ref: string, type: TokenType, description: string, cssProperty: string) =>
    alias(cssVar, ref, type, description, cssProperty, "component", "列表", ["component", "list", slug]);
  const dialog = (slug: string, cssVar: string, ref: string, type: TokenType, description: string, cssProperty: string) =>
    alias(cssVar, ref, type, description, cssProperty, "component", "对话框", ["component", "dialog", slug]);

  return [
    button("bg", "--button-bg", "--action-primary", "color", "主按钮填充。", "background-color"),
    button("fg", "--button-fg", "--action-primary-fg", "color", "主按钮文字。", "color"),
    button("bg-hover", "--button-bg-hover", "--action-primary-hover", "color", "主按钮悬停填充。", "background-color"),
    button("border", "--button-border", "--border-default", "color", "主按钮描边色。", "border-color"),
    button("radius", "--button-radius", "--radius-control", "dimension", "按钮圆角。", "border-radius"),
    button("padding-x", "--button-padding-x", "--space-control-x", "dimension", "按钮水平内边距。", "padding-inline"),
    button("padding-y", "--button-padding-y", "--space-control-y", "dimension", "按钮垂直内边距。", "padding-block"),
    button("font", "--button-font", "--font-body", "fontFamily", "按钮字体。", "font-family"),
    button("size", "--button-size", "--text-body", "dimension", "按钮字号。", "font-size"),
    button("weight", "--button-weight", "--weight-emphasis", "fontWeight", "按钮字重。", "font-weight"),
    button("shadow", "--button-shadow", "--shadow-subtle", "shadow", "按钮阴影。", "box-shadow"),
    button("border-width", "--button-border-width", "--border-width-control", "dimension", "按钮描边粗细。", "border-width"),
    button("secondary-bg", "--button-secondary-bg", "--action-secondary", "color", "次按钮填充。", "background-color"),
    button("secondary-fg", "--button-secondary-fg", "--fg-on-secondary", "color", "次按钮文字。", "color"),
    button("secondary-border", "--button-secondary-border", "--border-default", "color", "次按钮描边。", "border-color"),
    button("disabled-bg", "--button-disabled-bg", "--state-disabled", "color", "禁用按钮填充。", "background-color"),
    button("disabled-fg", "--button-disabled-fg", "--state-disabled-fg", "color", "禁用按钮文字。", "color"),
    input("bg", "--input-bg", "--bg-surface", "color", "输入框填充。", "background-color"),
    input("fg", "--input-fg", "--fg-primary", "color", "输入文字。", "color"),
    input("placeholder", "--input-placeholder", "--fg-muted", "color", "占位文字。", "color"),
    input("border", "--input-border", "--border-default", "color", "输入框描边。", "border-color"),
    input("radius", "--input-radius", "--radius-control", "dimension", "输入框圆角。", "border-radius"),
    input("height", "--input-height", "--size-control", "dimension", "输入框高度。", "height"),
    input("padding-x", "--input-padding-x", "--space-control-x", "dimension", "输入框水平内边距。", "padding-inline"),
    input("font", "--input-font", "--font-body", "fontFamily", "输入框字体。", "font-family"),
    input("size", "--input-size", "--text-body", "dimension", "输入框字号。", "font-size"),
    input("focus", "--input-focus", "--action-primary", "color", "聚焦环颜色。", "outline-color"),
    input("border-width", "--input-border-width", "--border-width-control", "dimension", "输入框描边粗细。", "border-width"),
    card("bg", "--card-bg", "--bg-surface", "color", "卡片填充。", "background-color"),
    card("fg", "--card-fg", "--fg-primary", "color", "卡片文字。", "color"),
    card("muted", "--card-muted", "--fg-muted", "color", "卡片次要文字。", "color"),
    card("border", "--card-border", "--border-default", "color", "卡片描边。", "border-color"),
    card("radius", "--card-radius", "--radius-surface", "dimension", "卡片圆角。", "border-radius"),
    card("shadow", "--card-shadow", "--shadow-raised", "shadow", "卡片阴影。", "box-shadow"),
    card("padding", "--card-padding", "--space-container", "dimension", "卡片内边距。", "padding"),
    card("border-width", "--card-border-width", "--border-width-control", "dimension", "卡片描边粗细。", "border-width"),
    card("blur", "--card-blur", "--effect-blur-use", "dimension", "卡片背景模糊。", "backdrop-filter"),
    badge("bg", "--badge-bg", "--action-accent", "color", "徽章填充。", "background-color"),
    badge("fg", "--badge-fg", "--fg-on-accent", "color", "徽章文字。", "color"),
    badge("radius", "--badge-radius", "--radius-pill", "dimension", "徽章圆角。", "border-radius"),
    badge("font", "--badge-font", "--font-body", "fontFamily", "徽章字体。", "font-family"),
    badge("size", "--badge-size", "--text-caption", "dimension", "徽章字号。", "font-size"),
    badge("padding-x", "--badge-padding-x", "--space-inline", "dimension", "徽章水平内边距。", "padding-inline"),
    badge("border", "--badge-border", "--border-default", "color", "徽章描边。", "border-color"),
    badge("border-width", "--badge-border-width", "--border-width-divider", "dimension", "徽章描边粗细。", "border-width"),
    nav("bg", "--nav-bg", "--bg-surface", "color", "顶部导航填充。", "background-color"),
    nav("fg", "--nav-fg", "--fg-primary", "color", "导航文字。", "color"),
    nav("muted", "--nav-muted", "--fg-muted", "color", "导航弱项。", "color"),
    nav("border", "--nav-border", "--border-default", "color", "导航分割线。", "border-color"),
    nav("active", "--nav-active", "--action-primary", "color", "导航当前项。", "color"),
    nav("height", "--nav-height", "--size-control", "dimension", "导航高度。", "height"),
    nav("font", "--nav-font", "--font-body", "fontFamily", "导航字体。", "font-family"),
    nav("padding-x", "--nav-padding-x", "--space-container", "dimension", "导航水平内边距。", "padding-inline"),
    tabbar("bg", "--tabbar-bg", "--bg-surface", "color", "底部标签栏填充。", "background-color"),
    tabbar("fg", "--tabbar-fg", "--fg-muted", "color", "未选中标签。", "color"),
    tabbar("active", "--tabbar-active", "--action-primary", "color", "选中标签。", "color"),
    tabbar("border", "--tabbar-border", "--border-default", "color", "标签栏顶边。", "border-color"),
    tabbar("height", "--tabbar-height", "--size-tabbar", "dimension", "标签栏高度。", "height"),
    tabbar("font", "--tabbar-font", "--font-body", "fontFamily", "标签栏字体。", "font-family"),
    list("bg", "--list-bg", "--bg-surface", "color", "列表行填充。", "background-color"),
    list("fg", "--list-fg", "--fg-primary", "color", "列表主文字。", "color"),
    list("muted", "--list-muted", "--fg-muted", "color", "列表辅助文字。", "color"),
    list("divider", "--list-divider", "--border-default", "color", "列表分割线颜色。", "border-color"),
    list("padding-y", "--list-padding-y", "--space-stack", "dimension", "列表行垂直内边距。", "padding-block"),
    list("padding-x", "--list-padding-x", "--space-control-x", "dimension", "列表行水平内边距。", "padding-inline"),
    list("radius", "--list-radius", "--radius-control", "dimension", "独立列表行圆角。", "border-radius"),
    list("border-width", "--list-border-width", "--border-width-divider", "dimension", "列表分割线粗细。", "border-width"),
    dialog("bg", "--dialog-bg", "--bg-surface", "color", "对话框填充。", "background-color"),
    dialog("fg", "--dialog-fg", "--fg-primary", "color", "对话框文字。", "color"),
    dialog("muted", "--dialog-muted", "--fg-muted", "color", "对话框说明。", "color"),
    dialog("border", "--dialog-border", "--border-default", "color", "对话框描边。", "border-color"),
    dialog("radius", "--dialog-radius", "--radius-surface", "dimension", "对话框圆角。", "border-radius"),
    dialog("shadow", "--dialog-shadow", "--shadow-overlay", "shadow", "对话框阴影。", "box-shadow"),
    dialog("overlay", "--dialog-overlay", "--overlay", "color", "对话框遮罩。", "background-color"),
    dialog("padding", "--dialog-padding", "--space-container", "dimension", "对话框内边距。", "padding"),
    dialog("border-width", "--dialog-border-width", "--border-width-control", "dimension", "对话框描边粗细。", "border-width"),
  ];
}

function alias(
  cssVar: string,
  ref: string,
  type: TokenType,
  description: string,
  cssProperty: string,
  tier: TokenTier,
  group: string,
  path: string[],
): Draft {
  return { cssVar, value: "", ref, type, description, cssProperty, tier, group, path };
}

function font(slug: string, cssVar: string, value: string, description: string): Draft {
  return {
    cssVar,
    value,
    type: "fontFamily",
    description,
    cssProperty: "font-family",
    tier: "primitive",
    group: "字体",
    path: ["font", "primitive", slug],
  };
}

function weight(slug: string, cssVar: string, value: number, description: string): Draft {
  return {
    cssVar,
    value: String(value),
    type: "fontWeight",
    description,
    cssProperty: "font-weight",
    tier: "primitive",
    group: "字体",
    path: ["font", "primitive", slug],
  };
}

function dimension(
  _slug: string,
  cssVar: string,
  value: string,
  group: string,
  cssProperty: string,
  description: string,
  path: string[],
): Draft {
  return {
    cssVar,
    value,
    type: "dimension",
    description,
    cssProperty,
    tier: "primitive",
    group,
    path,
  };
}

function number(cssVar: string, value: string, description: string, path: string[], group: string): Draft {
  return {
    cssVar,
    value,
    type: "number",
    description,
    cssProperty: "content",
    tier: "primitive",
    group,
    path,
  };
}

function shadow(slug: string, cssVar: string, value: string, description: string): Draft {
  return {
    cssVar,
    value,
    type: "shadow",
    description,
    cssProperty: "box-shadow",
    tier: "primitive",
    group: "阴影",
    path: ["shadow", "primitive", slug],
  };
}

function duration(slug: string, cssVar: string, value: string, description: string): Draft {
  return {
    cssVar,
    value,
    type: "duration",
    description,
    cssProperty: "transition-duration",
    tier: "primitive",
    group: "动效",
    path: ["motion", "primitive", slug],
  };
}

function easing(cssVar: string, value: string, description: string): Draft {
  return {
    cssVar,
    value,
    type: "cubicBezier",
    description,
    cssProperty: "transition-timing-function",
    tier: "primitive",
    group: "动效",
    path: ["motion", "primitive", "easing"],
  };
}

function typeScale(base: number, ratio: number): Record<string, string> {
  const steps: Record<string, number> = {
    xs: base / ratio ** 2,
    sm: base / ratio,
    base,
    lg: base * ratio,
    xl: base * ratio ** 2,
    "2xl": base * ratio ** 3,
    "3xl": base * ratio ** 4,
    "4xl": base * ratio ** 5,
  };
  return Object.fromEntries(
    Object.entries(steps).map(([step, size]) => [step, `${round(size)}px`]),
  );
}

function spaceScale(density: StyleSeed["density"]): { step: number; value: string }[] {
  const unit = density === "compact" ? 3 : density === "spacious" ? 5 : 4;
  return [1, 2, 3, 4, 6, 8, 12, 16].map((step) => ({
    step,
    value: `${unit * step}px`,
  }));
}

function semanticSpacing(density: StyleSeed["density"]): {
  inline: string;
  stack: string;
  container: string;
  controlX: string;
  controlY: string;
} {
  if (density === "compact") {
    return {
      inline: "--space-2",
      stack: "--space-3",
      container: "--space-4",
      controlX: "--space-4",
      controlY: "--space-2",
    };
  }
  if (density === "spacious") {
    return {
      inline: "--space-4",
      stack: "--space-6",
      container: "--space-8",
      controlX: "--space-6",
      controlY: "--space-3",
    };
  }
  return {
    inline: "--space-3",
    stack: "--space-4",
    container: "--space-6",
    controlX: "--space-4",
    controlY: "--space-2",
  };
}

function controlSize(seed: StyleSeed): string {
  if (seed.id === "material-3") return "48px";
  if (seed.id === "ibm-carbon") return "32px";
  const base = seed.density === "compact" ? 40 : seed.density === "spacious" ? 48 : 44;
  const sized = seed.platforms.includes("mobile") ? Math.max(44, base) : base;
  return `${sized}px`;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

