import { previewAppearance, industriesForStyle, INDUSTRIES } from "@/lib/styles/discovery";
import { MiniPreview } from "@/components/preview/mini-preview";
import { Badge } from "@/components/ui/badge";
import type { Platform, StyleSeed } from "@/lib/styles/types";
import Link from "next/link";

export function StyleCard({
  style,
  previewMode = "web",
}: {
  style: StyleSeed;
  previewMode?: Platform | "all";
}) {
  return (
    <Link
      href={`/styles/${style.id}`}
      data-slot="style-card"
      className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className="border-b bg-muted/30">
        <MiniPreview seed={style} mode={previewMode === "all" ? "web" : previewMode} />
      </div>
      <div className="flex items-start justify-between gap-3 p-3">
        <div className="min-w-0">
          <h3 className="truncate font-medium">{style.name}</h3>
          <p className="truncate font-mono text-xs text-muted-foreground">{style.nameEn}</p>
        </div>
        <span className="inline-flex h-7 shrink-0 items-center rounded-lg border bg-background px-2.5 text-xs font-medium">
          详情
        </span>
      </div>
      <div className="flex flex-wrap gap-1 px-3 pb-3">
        <Badge variant="outline">{previewAppearance(style) === "dark" ? "深色预览" : "浅色预览"}</Badge>
        {industriesForStyle(style.id).slice(0, 2).map(id => <Badge key={id} variant="secondary">{INDUSTRIES.find(([key]) => key === id)?.[1]}</Badge> )}
        {style.platforms.map((platform) => (
          <Badge key={platform} variant="outline">
            {platform === "web" ? "Web" : "移动端"}
          </Badge>
        ))}
      </div>
    </Link>
  );
}

