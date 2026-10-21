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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CATEGORIES } from "@/lib/styles/categories";
import { collectTags, filterStyles, STYLES } from "@/lib/styles";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function Gallery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const query = {
    q: searchParams.get("q") ?? "",
    cat: searchParams.get("cat") ?? "",
    platform: searchParams.get("platform") ?? "",
    tag: searchParams.get("tag") ?? "",
  };

  function update(partial: Partial<Record<"q" | "cat" | "platform" | "tag", string | null>>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(partial)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }

  const counted = filterStyles(STYLES, { q: query.q, platform: query.platform, tag: query.tag });
  const visible = filterStyles(STYLES, query);
  const counts = Object.fromEntries(CATEGORIES.map((category) => [category.id, counted.filter((style) => style.category === category.id).length]));
  const tags = collectTags(filterStyles(STYLES, { q: query.q, cat: query.cat, platform: query.platform }));
  const grouped = !query.q && !query.platform && !query.tag;
  const sections = grouped
    ? CATEGORIES.filter((category) => !query.cat || category.id === query.cat).map((category) => ({
        category,
        styles: visible.filter((style) => style.category === category.id),
      })).filter((section) => section.styles.length > 0)
    : [];
  const activeCategory = CATEGORIES.find((category) => category.id === query.cat);

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
            active={query.cat}
            counts={counts}
            total={counted.length}
            onSelect={(category) => {
              update({ cat: category || null });
              setMenuOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>
      <div className="mx-auto flex max-w-[1440px]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r lg:block">
          <CategoryNav
            active={query.cat}
            counts={counts}
            total={counted.length}
            onSelect={(category) => update({ cat: category || null })}
          />
        </aside>
        <main id="main" className="min-w-0 flex-1">
          <div className="sticky top-14 z-30 border-b bg-background/90 px-4 py-3 backdrop-blur">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ToggleGroup
                  value={[query.platform || "all"]}
                  onValueChange={(next) => {
                    const value = next[next.length - 1] ?? "all";
                    update({ platform: value === "all" ? null : value });
                  }}
                  spacing={0}
                  variant="outline"
                  size="sm"
                  aria-label="平台"
                >
                  <ToggleGroupItem value="all">全部</ToggleGroupItem>
                  <ToggleGroupItem value="web">Web</ToggleGroupItem>
                  <ToggleGroupItem value="mobile">移动端</ToggleGroupItem>
                </ToggleGroup>
                <div className="min-w-0 flex-1">
                  <label className="sr-only" htmlFor="style-search">
                    搜索风格
                  </label>
                  <Input
                    id="style-search"
                    value={query.q}
                    onChange={(event) => update({ q: event.target.value || null })}
                    placeholder="搜索名称、英文名、标签或关键词"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1" aria-label="标签">
                {tags.map(({ tag, count }) => (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={query.tag === tag}
                    onClick={() => update({ tag: query.tag === tag ? null : tag })}
                    className="shrink-0 rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <Badge variant={query.tag === tag ? "default" : "outline"}>
                      {tag}
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
            {visible.length === 0 ? (
              <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed px-6 py-16">
                <h2 className="text-lg font-medium">没有匹配的风格</h2>
                <p className="text-sm text-muted-foreground">试试更短的关键词，或清除平台和标签筛选。</p>
                <Button type="button" variant="outline" onClick={() => update({ q: null, cat: null, platform: null, tag: null })}>
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
                    <StyleGrid styles={section.styles} />
                  </section>
                ))}
              </div>
            ) : (
              <StyleGrid styles={visible} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function StyleGrid({ styles }: { styles: typeof STYLES }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {styles.map((style) => (
        <StyleCard key={style.id} style={style} />
      ))}
    </div>
  );
}
