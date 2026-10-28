/**
 * Convert UI UX Pro Max source CSVs into gallery seeds + recommend catalog.
 * Run: node --import ./scripts/register.mjs scripts/generate-promax.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseColor, readableOn, contrastRatio, mixColors } from "../src/lib/color.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "src/lib/styles/sources/ui-ux-pro-max");
const data = JSON.parse(fs.readFileSync(path.join(sourceDir, "integration.json"), "utf8"));

const ZH = data.chineseNames ?? {};

function extractHexes(text = "") {
  const found = [];
  const re = /#([0-9a-fA-F]{3,8})\b/g;
  let match;
  while ((match = re.exec(text))) {
    let h = match[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
    if (h.length >= 6) found.push(`#${h.slice(0, 6).toUpperCase()}`);
  }
  return [...new Set(found)];
}

function luminance(hex) {
  const c = parseColor(hex);
  if (!c) return 0.5;
  const t = (n) => {
    const v = n / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * t(c.r) + 0.7152 * t(c.g) + 0.0722 * t(c.b);
}

function parseVars(text = "") {
  const out = {};
  for (const part of text.split(",")) {
    const m = part.trim().match(/^--([\w-]+):\s*(.+)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

function parseRadius(vars) {
  const raw = vars["border-radius"] || vars.radius || "8px";
  const num = Number.parseFloat(raw);
  if (!Number.isFinite(num) || raw.includes("0px") && num === 0) {
    return { radiusSm: "0px", radiusMd: "0px", radiusLg: "0px", radiusFull: "0px", borderWidth: vars["border-style"] ? "2px" : "1px" };
  }
  const base = Math.max(2, Math.min(28, num || 8));
  return {
    radiusSm: `${Math.round(base * 0.5)}px`,
    radiusMd: `${Math.round(base)}px`,
    radiusLg: `${Math.round(base * 1.5)}px`,
    radiusFull: "999px",
    borderWidth: /brutal|visible/i.test(JSON.stringify(vars)) ? "2px" : "1px",
  };
}

function parseShadows(vars, effects) {
  const soft1 = vars["shadow-soft-1"];
  const soft2 = vars["shadow-soft-2"];
  if (soft1 && soft2) {
    const layered = `${soft1} rgba(0,0,0,0.12), ${soft2} rgba(255,255,255,0.7)`;
    return { shadowSm: layered, shadowMd: layered, shadowLg: layered };
  }
  if (/none|no shadow/i.test(effects) || vars.shadow === "none") {
    return { shadowSm: "none", shadowMd: "none", shadowLg: "none" };
  }
  if (/hard|offset|brutal/i.test(effects)) {
    return {
      shadowSm: "2px 2px 0 #111111",
      shadowMd: "4px 4px 0 #111111",
      shadowLg: "6px 6px 0 #111111",
    };
  }
  if (/soft|neomorph|clay|emboss/i.test(effects)) {
    return {
      shadowSm: "4px 4px 10px rgba(0,0,0,0.08), -3px -3px 8px rgba(255,255,255,0.7)",
      shadowMd: "8px 8px 18px rgba(0,0,0,0.1), -6px -6px 14px rgba(255,255,255,0.75)",
      shadowLg: "14px 14px 28px rgba(0,0,0,0.12), -10px -10px 22px rgba(255,255,255,0.8)",
    };
  }
  return {
    shadowSm: "0 1px 2px rgba(15,23,42,0.08)",
    shadowMd: "0 8px 24px rgba(15,23,42,0.12)",
    shadowLg: "0 18px 40px rgba(15,23,42,0.16)",
  };
}

function pickProductPalette(row) {
  const hay = `${row["Best For"]} ${row.Keywords} ${row.Type}`.toLowerCase();
  const scored = data.colors.map((color) => {
    const type = color["Product Type"].toLowerCase();
    let score = 0;
    for (const token of type.split(/[^a-z0-9]+/).filter(Boolean)) {
      if (token.length > 2 && hay.includes(token)) score += 1;
    }
    return { color, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].color : data.colors[0];
}

function buildColors(row) {
  const darkPreferred = row["Preferred Mode"] === "dark" || /dark|oled|cyber|neon|night/i.test(row["Style Category"]);
  const hexes = extractHexes(`${row["Primary Colors"]} ${row["Secondary Colors"]}`);
  const sorted = [...hexes].sort((a, b) => luminance(a) - luminance(b));
  const product = pickProductPalette(row);

  let background = darkPreferred ? "#0B1220" : "#FFFFFF";
  let foreground = darkPreferred ? "#F8FAFC" : "#111827";
  let primary = product.Primary || "#2563EB";
  let secondary = product.Secondary || "#E2E8F0";
  let accent = product.Accent || primary;
  let surface = darkPreferred ? "#111827" : "#FFFFFF";
  let surfaceAlt = darkPreferred ? "#1E293B" : "#F8FAFC";
  let muted = darkPreferred ? "#94A3B8" : "#64748B";
  let border = darkPreferred ? "#334155" : "#E2E8F0";

  if (sorted.length) {
    const lightest = sorted[sorted.length - 1];
    const darkest = sorted[0];
    if (darkPreferred) {
      background = darkest;
      foreground = lightest;
      surface = mixColors(darkest, "#ffffff", 0.08);
      surfaceAlt = mixColors(darkest, "#ffffff", 0.14);
      border = mixColors(darkest, "#ffffff", 0.22);
      muted = mixColors(lightest, darkest, 0.45);
    } else {
      background = luminance(lightest) > 0.7 ? lightest : "#FFFFFF";
      foreground = darkest;
      surface = "#FFFFFF";
      surfaceAlt = mixColors(background, darkest, 0.04);
      border = mixColors(background, darkest, 0.12);
      muted = mixColors(darkest, background, 0.45);
    }
    const mid = sorted[Math.floor(sorted.length / 2)] || sorted[0];
    const vivid = sorted.find((c) => {
      const p = parseColor(c);
      if (!p) return false;
      const max = Math.max(p.r, p.g, p.b);
      const min = Math.min(p.r, p.g, p.b);
      return max - min > 40;
    }) || mid;
    primary = vivid;
    secondary = darkPreferred ? mixColors(surface, "#ffffff", 0.1) : mixColors(background, primary, 0.12);
    accent = sorted.find((c) => c !== primary && c !== background) || primary;
  } else {
    background = product.Background;
    foreground = product.Foreground;
    primary = product.Primary;
    secondary = product.Secondary;
    accent = product.Accent;
    surface = product.Card;
    surfaceAlt = product.Muted;
    muted = product["Muted Foreground"];
    border = product.Border;
  }

  // Guarantee secondary button contrast for audit tests.
  let secondaryFg = readableOn(secondary, background);
  if ((contrastRatio(secondaryFg, secondary) ?? 0) < 4.5) {
    secondary = darkPreferred ? "#1E293B" : "#E2E8F0";
    secondaryFg = readableOn(secondary, background);
  }
  if ((contrastRatio(secondaryFg, secondary) ?? 0) < 4.5) {
    secondary = darkPreferred ? "#334155" : "#CBD5E1";
    secondaryFg = readableOn(secondary, background);
  }

  const primaryFg = readableOn(primary, background);
  return {
    background,
    surface,
    surfaceAlt,
    foreground,
    muted,
    border,
    primary,
    primaryForeground: primaryFg,
    secondary,
    accent,
    success: product.Notes?.includes("green") ? "#16A34A" : "#15803D",
    warning: "#B45309",
    danger: product.Destructive || "#DC2626",
    _secondaryFg: secondaryFg,
  };
}

function pickFonts(row) {
  const hay = `${row.Keywords} ${row["AI Prompt Keywords"]} ${row["Style Category"]}`.toLowerCase();
  let best = data.typography[0];
  let bestScore = -1;
  for (const font of data.typography) {
    const mood = `${font["Mood/Style Keywords"]} ${font.Category} ${font["Best For"]}`.toLowerCase();
    let score = 0;
    for (const token of mood.split(/[^a-z0-9]+/).filter((t) => t.length > 3)) {
      if (hay.includes(token)) score += 1;
    }
    if (score > bestScore) {
      best = font;
      bestScore = score;
    }
  }
  const heading = best["Heading Font"] || "Inter";
  const body = best["Body Font"] || "Inter";
  const stack = (name) => `"${name}", "Noto Sans SC", system-ui, sans-serif`;
  const mono = '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace';
  return {
    sans: stack(body),
    display: stack(heading),
    mono,
    pairing: best["Font Pairing Name"],
  };
}

function platformsFor(row) {
  const mobile = row["Mobile-Friendly"];
  if (mobile === "not-recommended") return ["web"];
  if (row.Type === "Mobile") return ["mobile", "web"];
  if (mobile === "native") return ["mobile", "web"];
  return ["web", "mobile"];
}

function densityFor(row) {
  if (/compact|dense|dashboard|bi/i.test(`${row.Type} ${row.Keywords}`)) return "compact";
  if (/spacious|editorial|magazine|minimal/i.test(`${row.Keywords} ${row["Style Category"]}`)) return "spacious";
  return "comfortable";
}

function tagsFor(row, dark) {
  const tags = ["Pro Max"];
  tags.push(dark ? "深色" : "浅色");
  if (row.Type) tags.push(row.Type);
  if (row.Status === "supplemental") tags.push("补充变体");
  if (/rounded|soft|clay|glass/i.test(row.Keywords)) tags.push("圆角");
  if (/brutal|sharp|0px|grid/i.test(`${row.Keywords} ${row["Design System Variables"]}`)) tags.push("直角");
  if (/high contrast|accessible/i.test(`${row.Keywords} ${row.Accessibility}`)) tags.push("高对比");
  return [...new Set(tags)].slice(0, 8);
}

function splitList(text = "") {
  return text
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
}

const seeds = data.styles.map((row) => {
  const id = `pm-${row["Style ID"]}`;
  const colors = buildColors(row);
  const vars = parseVars(row["Design System Variables"] || "");
  const shape = parseRadius(vars);
  const elevation = parseShadows(vars, row["Effects & Animation"] || "");
  const fonts = pickFonts(row);
  const dark = luminance(colors.background) < 0.35;
  const blur = vars["blur-amount"] || (/blur|glass|frost/i.test(row["Effects & Animation"] || "") ? "16px" : undefined);
  const opacity = vars["glass-opacity"] ? Number.parseFloat(vars["glass-opacity"]) : undefined;

  const checklist = splitList(row["Implementation Checklist"]);
  const principles = [
    ...(row.Keywords ? splitList(row.Keywords).slice(0, 3).map((k) => `关键词约束：${k}`) : []),
    row["Effects & Animation"] ? `动效与材质：${row["Effects & Animation"].slice(0, 120)}` : null,
    row.Accessibility ? `无障碍提示：${row.Accessibility.slice(0, 120)}` : null,
  ].filter(Boolean).slice(0, 5);

  while (principles.length < 3) principles.push("以 UI UX Pro Max 原文检查清单为准，落地前做平台与对比验收。");

  return {
    id,
    name: ZH[row["Style Category"]] || row["Style Category"],
    nameEn: row["Style Category"],
    category: "promax",
    platforms: platformsFor(row),
    tags: tagsFor(row, dark),
    summary: `${row["Style Category"]}（UI UX Pro Max）。适合：${row["Best For"]}。本条目由上游风格目录自动映射为可预览 token，不等同于官方组件库复刻。`,
    keywords: [
      ...splitList(row.Keywords),
      ...splitList(row["AI Prompt Keywords"]),
      row["Style ID"],
      "ui-ux-pro-max",
      "pro max",
    ],
    principles,
    dos: splitList(row["Implementation Checklist"]).length
      ? checklist
      : splitList(row["Best For"]).map((s) => `适用于：${s}`),
    donts: splitList(row["Do Not Use For"]).map((s) => `避免用于：${s}`).slice(0, 6),
    useCases: splitList(row["Best For"]),
    platformNotes: {
      web: `上游类型 ${row.Type}；框架提示：${row["Framework Compatibility"] || "通用 Web"}。`,
      mobile: `移动适配标记：${row["Mobile-Friendly"]}。原生交互仍需按 iOS/Android 规范单独验收。`,
    },
    colors: {
      background: colors.background,
      surface: colors.surface,
      surfaceAlt: colors.surfaceAlt,
      foreground: colors.foreground,
      muted: colors.muted,
      border: colors.border,
      primary: colors.primary,
      primaryForeground: colors.primaryForeground,
      secondary: colors.secondary,
      accent: colors.accent,
      success: colors.success,
      warning: colors.warning,
      danger: colors.danger,
    },
    typography: {
      sans: fonts.sans,
      display: fonts.display,
      mono: fonts.mono,
      baseSize: 16,
      scaleRatio: 1.25,
      headingWeight: /brutal|display|poster|impact/i.test(row.Keywords) ? 800 : 600,
      bodyWeight: 400,
      letterSpacing: dark ? "0" : "-0.01em",
    },
    shape,
    elevation,
    effects: blur
      ? {
          backdropBlur: blur,
          surfaceOpacity: Number.isFinite(opacity) ? opacity : 0.16,
          backgroundImage: dark
            ? "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.35), transparent 42%), radial-gradient(circle at 80% 0%, rgba(14,165,233,0.28), transparent 36%), #0B1220"
            : "radial-gradient(circle at 15% 10%, rgba(59,130,246,0.18), transparent 40%), radial-gradient(circle at 90% 20%, rgba(236,72,153,0.12), transparent 36%), #F8FAFC",
        }
      : undefined,
    motion: {
      durationFast: /0s|instant|none/i.test(row["Effects & Animation"] || "") ? "0ms" : "120ms",
      durationBase: /0s|instant|none/i.test(row["Effects & Animation"] || "") ? "0ms" : "220ms",
      easing: "cubic-bezier(0.2, 0, 0, 1)",
    },
    density: densityFor(row),
    _meta: {
      styleId: row["Style ID"],
      status: row.Status,
      type: row.Type,
      source: "ui-ux-pro-max",
      fontPairing: fonts.pairing,
      preferredMode: row["Preferred Mode"],
      lightMode: row["Light Mode ✓"],
      darkMode: row["Dark Mode ✓"],
    },
  };
});

// Strip _meta from seeds written as StyleSeed; keep meta sidecar
const styleSeeds = seeds.map((entry) => {
  const { _meta: _ignored, ...seed } = entry;
  void _ignored;
  return seed;
});
const meta = Object.fromEntries(seeds.map((s) => [s.id, s._meta]));

const recommend = {
  repository: data.repository,
  revision: data.revision,
  license: data.license,
  products: data.products,
  colors: data.colors,
  typography: data.typography,
  reasoning: data.reasoning,
  styleIndex: data.styles.map((row) => ({
    id: `pm-${row["Style ID"]}`,
    styleId: row["Style ID"],
    name: ZH[row["Style Category"]] || row["Style Category"],
    nameEn: row["Style Category"],
    status: row.Status,
    type: row.Type,
    bestFor: row["Best For"],
    keywords: row.Keywords,
  })),
};

const seedsPath = path.join(root, "src/lib/styles/seeds/promax.generated.json");
const metaPath = path.join(sourceDir, "promax-meta.json");
const recommendPath = path.join(sourceDir, "recommend.json");
fs.writeFileSync(seedsPath, JSON.stringify(styleSeeds, null, 2));
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
fs.writeFileSync(recommendPath, JSON.stringify(recommend, null, 2));
console.log(`wrote ${styleSeeds.length} seeds → ${path.relative(root, seedsPath)}`);
console.log(`recommend products ${recommend.products.length}`);
