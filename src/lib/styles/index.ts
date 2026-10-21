import { CATEGORIES, getCategory } from "@/lib/styles/categories";
import { artSeeds } from "@/lib/styles/seeds/art";
import { eraSeeds } from "@/lib/styles/seeds/era";
import { platformSeeds } from "@/lib/styles/seeds/platform";
import { themeSeeds } from "@/lib/styles/seeds/theme";
import { visualSeeds } from "@/lib/styles/seeds/visual";
import { buildTokens } from "@/lib/styles/tokens";
import type { CategoryId, Platform, StyleSeed } from "@/lib/styles/types";

export const STYLES: StyleSeed[] = [
  ...platformSeeds,
  ...visualSeeds,
  ...artSeeds,
  ...eraSeeds,
  ...themeSeeds,
];

const byId = new Map(STYLES.map((style) => [style.id, style]));

if (byId.size !== STYLES.length) {
  throw new Error("Duplicate style id");
}

for (const style of STYLES) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(style.id)) {
    throw new Error(`Style id must be kebab-case: ${style.id}`);
  }
  const tokens = buildTokens(style);
  if (tokens.component.some((token) => !token.alias)) {
    throw new Error(`${style.id} has a component token without an alias`);
  }
}

export function getStyle(id: string): StyleSeed | undefined {
  return byId.get(id);
}

export function getAdjacent(id: string): { prev: StyleSeed; next: StyleSeed } | null {
  const index = STYLES.findIndex((style) => style.id === id);
  if (index < 0) return null;
  return {
    prev: STYLES[(index - 1 + STYLES.length) % STYLES.length],
    next: STYLES[(index + 1) % STYLES.length],
  };
}

export function getStylesByCategory(category: CategoryId): StyleSeed[] {
  return STYLES.filter((style) => style.category === category);
}

export type StyleQuery = {
  q?: string;
  cat?: string;
  platform?: string;
  tag?: string;
};

export function filterStyles(styles: StyleSeed[], query: StyleQuery): StyleSeed[] {
  const q = (query.q ?? "").trim().toLowerCase();
  const platform = query.platform === "web" || query.platform === "mobile" ? query.platform : "";
  const category = CATEGORIES.some((item) => item.id === query.cat) ? (query.cat as CategoryId) : "";

  return styles.filter((style) => {
    if (category && style.category !== category) return false;
    if (platform && !style.platforms.includes(platform as Platform)) return false;
    if (query.tag && !style.tags.includes(query.tag)) return false;
    if (!q) return true;
    const haystack = [style.name, style.nameEn, ...style.tags, ...style.keywords].join("\n").toLowerCase();
    return haystack.includes(q);
  });
}

export function collectTags(styles: StyleSeed[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const style of styles) {
    for (const tag of style.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-CN"));
}

export { CATEGORIES, getCategory };
export type { Category } from "@/lib/styles/categories";
export type { DesignToken, StyleSeed, TokenSet, TokenTier, TokenType } from "@/lib/styles/types";
export { buildTokens, contrastPair, resolvedValue } from "@/lib/styles/tokens";
