export type RGBA = { r: number; g: number; b: number; a: number };

export function parseColor(input: string): RGBA | null {
  const value = input.trim();
  const hex = value.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) {
      h = h
        .split("")
        .map((channel) => channel + channel)
        .join("");
    }
    if (h.length !== 6 && h.length !== 8) return null;
    return {
      r: Number.parseInt(h.slice(0, 2), 16),
      g: Number.parseInt(h.slice(2, 4), 16),
      b: Number.parseInt(h.slice(4, 6), 16),
      a: h.length === 8 ? Number.parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }

  const rgb = value.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i,
  );
  if (!rgb) return null;
  return {
    r: Number(rgb[1]),
    g: Number(rgb[2]),
    b: Number(rgb[3]),
    a: rgb[4] === undefined ? 1 : Number(rgb[4]),
  };
}

export function formatColor({ r, g, b, a }: RGBA): string {
  const R = clampChannel(r);
  const G = clampChannel(g);
  const B = clampChannel(b);
  if (a >= 0.999) {
    return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
  }
  const alpha = Math.round(a * 1000) / 1000;
  return `rgba(${R}, ${G}, ${B}, ${alpha})`;
}

export function composite(foreground: RGBA, background: RGBA): RGBA {
  const alpha = foreground.a + background.a * (1 - foreground.a);
  const channel = (fg: number, bg: number) =>
    alpha === 0 ? 0 : (fg * foreground.a + bg * background.a * (1 - foreground.a)) / alpha;
  return {
    r: channel(foreground.r, background.r),
    g: channel(foreground.g, background.g),
    b: channel(foreground.b, background.b),
    a: alpha,
  };
}

export function withAlpha(color: string, alpha: number): string {
  const parsed = parseColor(color);
  if (!parsed) return color;
  return formatColor({ ...parsed, a: alpha });
}

export function mixColors(a: string, b: string, amount: number): string {
  const start = parseColor(a);
  const end = parseColor(b);
  if (!start || !end) return a;
  const mix = (from: number, to: number) => from + (to - from) * amount;
  return formatColor({
    r: mix(start.r, end.r),
    g: mix(start.g, end.g),
    b: mix(start.b, end.b),
    a: mix(start.a, end.a),
  });
}

function relativeLuminance(color: RGBA): number {
  const transform = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * transform(color.r) + 0.7152 * transform(color.g) + 0.0722 * transform(color.b);
}

export function opaqueColor(color: string, behind = "#ffffff"): string {
  const parsed = parseColor(color);
  const base = parseColor(behind);
  if (!parsed || !base) return color;
  const flattened = parsed.a < 1 ? composite(parsed, base) : parsed;
  return formatColor({ ...flattened, a: 1 });
}

export function contrastRatio(foreground: string, background: string): number | null {
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  if (!fg || !bg) return null;
  const bgOpaque = bg.a < 1 ? composite(bg, { r: 255, g: 255, b: 255, a: 1 }) : bg;
  const top = fg.a < 1 ? composite(fg, bgOpaque) : fg;
  const lighter = Math.max(relativeLuminance(top), relativeLuminance(bgOpaque));
  const darker = Math.min(relativeLuminance(top), relativeLuminance(bgOpaque));
  return (lighter + 0.05) / (darker + 0.05);
}

export function readableOn(background: string, behind = "#ffffff"): string {
  const opaque = opaqueColor(background, behind);
  const white = contrastRatio("#ffffff", opaque) ?? 0;
  const black = contrastRatio("#161616", opaque) ?? 0;
  return white >= black ? "#ffffff" : "#161616";
}

export function hoverColor(color: string, behind = "#ffffff"): string {
  const opaque = opaqueColor(color, behind);
  const parsed = parseColor(opaque);
  if (!parsed) return color;
  const light = relativeLuminance(parsed) > 0.45;
  return mixColors(opaque, light ? "#000000" : "#ffffff", light ? 0.14 : 0.16);
}

export function wcagLevel(ratio: number | null): "AAA" | "AA" | "AA Large" | "Fail" {
  if (ratio === null) return "Fail";
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function toHex(value: number): string {
  return value.toString(16).padStart(2, "0");
}
