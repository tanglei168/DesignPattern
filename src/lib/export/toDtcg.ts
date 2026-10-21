import { dtcgValue } from "@/lib/export/format";
import { buildTokens } from "@/lib/styles/tokens";
import type { StyleSeed } from "@/lib/styles/types";

export function toDtcg(seed: StyleSeed): string {
  const { all } = buildTokens(seed);
  const root: Record<string, unknown> = {
    $extensions: {
      "com.design-style-gallery": {
        id: seed.id,
        name: seed.name,
        nameEn: seed.nameEn,
        version: "1.0.0",
        category: seed.category,
        platforms: seed.platforms,
      },
    },
  };

  for (const token of all) {
    let node = root;
    for (const segment of token.path.slice(0, -1)) {
      const existing = node[segment];
      if (!existing || typeof existing !== "object") {
        node[segment] = {};
      }
      node = node[segment] as Record<string, unknown>;
    }
    const leaf = token.path[token.path.length - 1];
    const extensions: Record<string, unknown> = {
      "com.design-style-gallery": {
        cssVar: token.cssVar,
        cssProperty: token.cssProperty,
        tier: token.tier,
      },
    };
    if (token.type === "shadow" && !token.alias) {
      (extensions["com.design-style-gallery"] as Record<string, unknown>).css = token.value;
    }
    node[leaf] = {
      $value: dtcgValue(token),
      $type: token.type,
      $description: token.description,
      $extensions: extensions,
    };
  }

  return `${JSON.stringify(root, null, 2)}\n`;
}
