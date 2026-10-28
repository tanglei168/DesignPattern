import recommend from "@/lib/styles/sources/ui-ux-pro-max/recommend.json";

export type RecommendProduct = (typeof recommend.products)[number];
export type RecommendColor = (typeof recommend.colors)[number];
export type RecommendTypography = (typeof recommend.typography)[number];
export type RecommendStyleIndex = (typeof recommend.styleIndex)[number];

export const PRO_MAX_META = {
  repository: recommend.repository,
  revision: recommend.revision,
  license: recommend.license,
  styleCount: recommend.styleIndex.length,
  productCount: recommend.products.length,
  colorCount: recommend.colors.length,
  typographyCount: recommend.typography.length,
} as const;

export function listProducts(): RecommendProduct[] {
  return recommend.products;
}

export function getProduct(no: string): RecommendProduct | undefined {
  return recommend.products.find((item) => item.No === no);
}

export function getColorForProduct(productType: string): RecommendColor | undefined {
  return recommend.colors.find((item) => item["Product Type"] === productType);
}

function normalize(text: string): string {
  return text.toLowerCase();
}

function scoreStyle(style: RecommendStyleIndex, product: RecommendProduct): number {
  const hay = normalize(`${style.nameEn} ${style.keywords} ${style.bestFor}`);
  const needles = normalize(
    `${product["Product Type"]} ${product.Keywords} ${product["Primary Style Recommendation"]} ${product["Secondary Styles"]} ${product["Color Palette Focus"]}`,
  )
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
  let score = 0;
  for (const token of needles) {
    if (hay.includes(token)) score += 1;
  }
  const primary = normalize(product["Primary Style Recommendation"] || "");
  if (primary && normalize(style.nameEn).includes(primary.split("+")[0].trim())) score += 5;
  for (const part of normalize(product["Secondary Styles"] || "").split(/[,+]/)) {
    const name = part.trim();
    if (name && normalize(style.nameEn).includes(name)) score += 3;
  }
  if (style.status === "active") score += 1;
  return score;
}

export function recommendStylesForProduct(product: RecommendProduct, limit = 6): Array<RecommendStyleIndex & { score: number }> {
  return recommend.styleIndex
    .map((style) => ({ ...style, score: scoreStyle(style, product) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.nameEn.localeCompare(b.nameEn))
    .slice(0, limit);
}

export function recommendTypography(product: RecommendProduct): RecommendTypography {
  const hay = normalize(`${product["Product Type"]} ${product.Keywords} ${product["Key Considerations"]}`);
  let best = recommend.typography[0];
  let bestScore = -1;
  for (const font of recommend.typography) {
    const mood = normalize(`${font["Mood/Style Keywords"]} ${font["Best For"]} ${font.Category}`);
    let score = 0;
    for (const token of mood.split(/[^a-z0-9]+/).filter((t) => t.length > 3)) {
      if (hay.includes(token)) score += 1;
    }
    if (score > bestScore) {
      best = font;
      bestScore = score;
    }
  }
  return best;
}

export function findStyleByUpstreamId(styleId: string): RecommendStyleIndex | undefined {
  return recommend.styleIndex.find((item) => item.styleId === styleId || item.id === styleId || item.id === `pm-${styleId}`);
}
