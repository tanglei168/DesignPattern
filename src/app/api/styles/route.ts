import { industriesForStyle, previewAppearance } from "@/lib/styles/discovery";
import { styleApiLinks } from "@/lib/export/files";
import { STYLES } from "@/lib/styles";

export function GET() {
  return Response.json({
    count: STYLES.length,
    styles: STYLES.map((style) => ({
      id: style.id,
      name: style.name,
      nameEn: style.nameEn,
      category: style.category,
      platforms: style.platforms,
      industries: industriesForStyle(style.id),
      previewAppearance: previewAppearance(style),
      tags: style.tags,
      summary: style.summary,
      page: `/styles/${style.id}`,
      links: styleApiLinks(style.id),
    })),
  });
}

