import { parseColor } from "@/lib/color";
import type { DesignToken, TokenType } from "@/lib/styles/types";

export function cssValue(token: DesignToken): string {
  return token.value;
}

export function dtcgValue(token: DesignToken, baseSize = 16): unknown {
  if (token.alias) return token.alias;
  switch (token.type) {
    case "color": return dtcgColor(token.value);
    case "dimension": return dtcgDimension(token.value, baseSize);
    case "duration": {
      const match = token.value.match(/^([\d.]+)(ms|s)$/);
      if (!match) throw new Error(`Invalid duration: ${token.value}`);
      return { value: Number(match[1]), unit: match[2] };
    }
    case "fontFamily": return splitTopLevel(token.value.replace(/var\(--font-geist-sans,\s*"Geist"\)/g, '"Geist"').replace(/var\(--font-geist-mono,\s*"Geist Mono"\)/g, '"Geist Mono"')).map(name => name.trim().replace(/^['"]|['"]$/g, ""));
    case "fontWeight":
    case "number":
      return Number(token.value);
    case "cubicBezier":
      return parseCubicBezier(token.value);
    case "shadow":
      return parseShadow(token.value);
    default:
      return token.value;
  }
}

export function parseCubicBezier(value: string): number[] {
  const match = value.match(
    /cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/i,
  );
  if (!match) return [0, 0, 1, 1];
  return [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
}

type ShadowLayer = {
  color: ReturnType<typeof dtcgColor>;
  offsetX: ReturnType<typeof dtcgDimension>;
  offsetY: ReturnType<typeof dtcgDimension>;
  blur: ReturnType<typeof dtcgDimension>;
  spread: ReturnType<typeof dtcgDimension>;
  inset?: boolean;
};

export function parseShadow(value: string): ShadowLayer | ShadowLayer[] {
  if (value.trim() === "none") {
    return { color: dtcgColor("#00000000"), offsetX: dtcgDimension("0px"), offsetY: dtcgDimension("0px"), blur: dtcgDimension("0px"), spread: dtcgDimension("0px") };
  }
  const layers = splitTopLevel(value).map(parseShadowLayer);
  if (layers.some((layer) => layer === null)) {
    throw new Error(`Unsupported shadow: ${value}`);
  }
  const parsed = layers as ShadowLayer[];
  return parsed.length === 1 ? parsed[0] : parsed;
}

function parseShadowLayer(layer: string): ShadowLayer | null {
  const inset = /^inset\b/i.test(layer.trim());
  const body = layer.trim().replace(/^inset\s+/i, "");
  const length = "(-?(?:\\d*\\.?\\d+px|0))";
  const match = body.match(
    new RegExp(`^${length}\\s+${length}\\s+${length}(?:\\s+${length})?\\s+(.+)$`, "i"),
  );
  if (!match) return null;
  return {
    inset: inset || undefined,
    offsetX: dtcgDimension(normalizeLength(match[1])),
    offsetY: dtcgDimension(normalizeLength(match[2])),
    blur: dtcgDimension(normalizeLength(match[3])),
    spread: dtcgDimension(normalizeLength(match[4] ?? "0px")),
    color: dtcgColor(match[5].trim()),
  };
}

function normalizeLength(value: string): string {
  return value === "0" ? "0px" : value;
}

export function splitTopLevel(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of value) {
    if (char === "(") depth += 1;
    if (char === ")") depth = Math.max(0, depth - 1);
    if (char === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

export function markdownCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

export function tokenTable(tokens: DesignToken[]): string {
  const lines = ["| Token | CSS 属性 | 值 | 引用 |", "| --- | --- | --- | --- |"];
  for (const token of tokens) {
    lines.push(
      `| \`${markdownCell(token.name)}\` | ${markdownCell(token.cssProperty)} | \`${markdownCell(token.value)}\` | ${token.alias ? `\`${markdownCell(token.alias)}\`` : "—"} |`,
    );
  }
  return lines.join("\n");
}

export function isTokenType(value: string): value is TokenType {
  return (
    value === "color" ||
    value === "dimension" ||
    value === "fontFamily" ||
    value === "fontWeight" ||
    value === "shadow" ||
    value === "duration" ||
    value === "cubicBezier" ||
    value === "number"
  );
}


export function dtcgColor(value: string) {
  const c = parseColor(value);
  if (!c) throw new Error(`Unsupported color: ${value}`);
  return { colorSpace: "srgb", components: [c.r / 255, c.g / 255, c.b / 255], alpha: c.a };
}

export function dtcgDimension(value: string, baseSize = 16) {
  if (value === "0") return { value: 0, unit: "px" };
  const match = value.match(/^(-?[\d.]+)(px|rem|em)$/);
  if (!match) throw new Error(`Unsupported dimension: ${value}`);
  // DTCG accepts px/rem; preserve original relative CSS in extensions.
  return { value: Number(match[1]) * (match[2] === "em" ? baseSize : 1), unit: match[2] === "em" ? "px" : match[2] };
}
