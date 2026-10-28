"use client";

import { CATEGORIES, type Category } from "@/lib/styles/categories";
import { cn } from "@/lib/utils";
import { BrushIcon, ClockIcon, LayersIcon, PaletteIcon, SparklesIcon, SwatchBookIcon, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const ICONS: Record<Category["icon"], LucideIcon> = {
  layers: LayersIcon,
  palette: PaletteIcon,
  brush: BrushIcon,
  history: ClockIcon,
  swatch: SwatchBookIcon,
  sparkles: SparklesIcon,
};

export function CategoryNav({
  active,
  counts,
  total,
  onSelect,
}: {
  active: string;
  counts: Record<string, number>;
  total: number;
  onSelect: (category: string) => void;
}) {
  return (
    <nav aria-label="设计类型" className="flex flex-col gap-1 p-3">
      <p className="px-2.5 py-2 text-xs font-medium text-muted-foreground">设计类型 / Design Type</p>
      <CategoryButton active={active === ""} count={total} label="全部" labelEn="All" onClick={() => onSelect("")} />
      {CATEGORIES.map((category) => {
        const Icon = ICONS[category.icon];
        return (
          <CategoryButton
            key={category.id}
            active={active === category.id}
            count={counts[category.id] ?? 0}
            label={category.name}
            labelEn={category.nameEn}
            icon={<Icon />}
            onClick={() => onSelect(category.id)}
          />
        );
      })}
    </nav>
  );
}

function CategoryButton({
  active,
  count,
  label,
  labelEn,
  icon,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  labelEn: string;
  icon?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {icon ? <span className="text-foreground [&_svg]:size-4">{icon}</span> : null}
        <span className="min-w-0">
          <span className="block truncate">{label}</span>
          <span className="block truncate font-mono text-[10px] tracking-wide uppercase opacity-70">{labelEn}</span>
        </span>
      </span>
      <span className="shrink-0 text-xs tabular-nums">{count}</span>
    </button>
  );
}

