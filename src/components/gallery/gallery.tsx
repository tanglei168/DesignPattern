"use client";

import { CategoryNav } from "@/components/gallery/category-nav";
import { StyleCard } from "@/components/gallery/style-card";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CATEGORIES } from "@/lib/styles/categories";
import { collectTags, filterStyles, STYLES } from "@/lib/styles";
import type { Platform } from "@/lib/styles/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type PlatformFilter = "" | Platform;

type GalleryQuery = {
  q: string;
  cat: string;
  platform: PlatformFilter;
  tag: string;
};

const PLATFORM_OPTIONS: { value: PlatformFilter; label: string }[] = [
  { value: "", label: "全部" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "移动端" },
];

function readQuery(searchParams: URLSearchParams): GalleryQuery {
  const platform = searchParams.get("platform");
  return {
    q: searchParams.get("q") ?? "",
    cat: searchParams.get("cat") ?? "",
    platform: platform === "web" || platform === "mobile" ? platform : "",
    tag: searchParams.get("tag") ?? "",
  };
}

export function Gallery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [, startTransition] = useTransition();

  const urlQuery = readQuery(searchParams);
  // Local draft for instant UI; reconcile when the URL changes (back/forward).
  const [draft, setDraft] = useState(urlQuery);
  const [urlSnapshot, setUrlSnapshot] = useState(urlQuery);
  if (
    urlQuery.q !== urlSnapshot.q ||
    urlQuery.cat !== urlSnapshot.cat ||
    urlQuery.platform !== urlSnapshot.platform ||
    urlQuery.tag !== urlSnapshot.tag
  ) {
    setUrlSnapshot(urlQuery);
    setDraft(urlQuery);
  }

  const { q, cat, platform, tag } = draft;

  function patch(partial: Partial<GalleryQuery>) {
    const next = { ...draft, ...partial };
    setDraft(next);
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.cat) params.set("cat", next.cat);
    if (next.platform) params.set("platform", next.platform);
    if (next.tag) params.set("tag", next.tag);
    const queryString = params.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    });
  }

  const query = { q, cat, platform, tag };
  const counted = filterStyles(STYLES, { q, platform, tag });
  const visible = filterStyles(STYLES, query);
  const counts = Object.fromEntries(
    CATEGORIES.map((category) => [category.id, counted.filter((style) => style.category === category.id).length]),
  );
  const tags = collectTags(filterStyles(STYLES, { q, cat, platform }));
  const grouped = !q && !platform && !tag;
  const sections = grouped
    ? CATEGORIES.filter((category) => !cat || category.id === cat)
        .map((category) => ({
          category,
          styles: visible.filter((style) => style.category === category.id),
        }))
        .filter((section) => section.styles.length > 0)
    : [];
  const activeCategory = CATEGORIES.find((category) => category.id === cat);
  const previewMode: Platform | "all" = platform || "all";

  return (
    <div className="min-h-screen">
      <SiteHeader onMenu={() => setMenuOpen(true)} />
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b">
            <SheetTitle>分类</SheetTitle>
            <SheetDescription>按设计范式浏览</SheetDescription>
          </SheetHeader>
          <CategoryNav
            active={cat}
            counts={counts}
            total={counted.length}
            onSelect={(category) => {
              patch({ cat: category });
              setMenuOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>
      <div className="mx-auto flex max-w-[1440px]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r lg:block">
          <CategoryNav
            active={cat}
            counts={counts}
            total={counted.length}
            onSelect={(category) => patch({ cat: category })}
          />
        </aside>
        <main id="main" className="min-w-0 flex-1">
          <div className="sticky top-14 z-30 border-b bg-background/90 px-4 py-3 backdrop-blur">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div
                  role="group"
                  aria-label="平台"
                  className="inline-flex w-fit rounded-lg border p-0.5"
                >
                  {PLATFORM_OPTIONS.map((option) => {
                    const active = platform === option.value;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        aria-pressed={active}
                        onClick={() => patch({ platform: option.value })}
                        className={
                          active
                            ? "rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
                            : "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                        }
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                <div className="min-w-0 flex-1">
                  <label className="sr-only" htmlFor="style-search">
                    搜索风格
                  </label>
                  <Input
                    id="style-search"
                    value={q}
                    onChange={(event) => patch({ q: event.target.value })}
                    placeholder="搜索名称、英文名、标签或关键词"
                    autoComplete="off"
                  />
                </div>
                <p className="shrink-0 text-sm text-muted-foreground" aria-live="polite">
                  {visible.length} / {STYLES.length}
                </p>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1" aria-label="标签">
                {tags.map(({ tag: item, count }) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={tag === item}
                    onClick={() => patch({ tag: tag === item ? "" : item })}
                    className="shrink-0 rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <Badge variant={tag === item ? "default" : "outline"}>
                      {item}
                      <span className="opacity-70">{count}</span>
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-4 py-6">
            {activeCategory ? (
              <p className="mb-4 max-w-3xl text-sm text-muted-foreground">{activeCategory.description}</p>
            ) : null}
            {platform ? (
              <p className="mb-4 text-sm text-muted-foreground">
                正在查看适用于{platform === "web" ? " Web " : "移动端"}的 {visible.length}{" "}
                种风格；卡片预览已切换为对应设备框。
              </p>
            ) : null}
            {visible.length === 0 ? (
              <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed px-6 py-16">
                <h2 className="text-lg font-medium">没有匹配的风格</h2>
                <p className="text-sm text-muted-foreground">试试更短的关键词，或清除平台和标签筛选。</p>
                <Button type="button" variant="outline" onClick={() => patch({ q: "", cat: "", platform: "", tag: "" })}>
                  清除筛选
                </Button>
              </div>
            ) : grouped ? (
              <div className="flex flex-col gap-10">
                {sections.map((section) => (
                  <section key={section.category.id} aria-labelledby={`cat-${section.category.id}`}>
                    <div className="mb-4 flex items-end justify-between gap-3">
                      <div>
                        <h2 id={`cat-${section.category.id}`} className="text-lg font-semibold">
                          {section.category.name}
                        </h2>
                        <p className="font-mono text-xs text-muted-foreground">{section.category.nameEn}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{section.styles.length}</span>
                    </div>
                    <StyleGrid styles={section.styles} previewMode={previewMode} />
                  </section>
                ))}
              </div>
            ) : (
              <StyleGrid styles={visible} previewMode={previewMode} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function StyleGrid({
  styles,
  previewMode,
}: {
  styles: typeof STYLES;
  previewMode: Platform | "all";
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {styles.map((style) => (
        <StyleCard key={style.id} style={style} previewMode={previewMode} />
      ))}
    </div>
  );
}
