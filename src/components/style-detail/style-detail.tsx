"use client";

import { MobileMockup } from "@/components/preview/mobile-mockup";
import { StyleScope } from "@/components/preview/style-scope";
import { WebMockup } from "@/components/preview/web-mockup";
import { ExportPanel } from "@/components/style-detail/export-panel";
import { TokenPanel } from "@/components/style-detail/token-panel";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contrastRatio, wcagLevel } from "@/lib/color";
import { getCategory } from "@/lib/styles/categories";
import type { StyleSeed } from "@/lib/styles/types";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SECTIONS = [
  { id: "overview", label: "概览" },
  { id: "preview", label: "预览" },
  { id: "color", label: "色彩" },
  { id: "type", label: "字体" },
  { id: "shape", label: "形状与阴影" },
  { id: "components", label: "组件" },
  { id: "tokens", label: "Token" },
  { id: "export", label: "导出" },
] as const;

const COLOR_FIELDS: { key: keyof StyleSeed["colors"]; label: string }[] = [
  { key: "background", label: "画布" },
  { key: "surface", label: "表面" },
  { key: "surfaceAlt", label: "次表面" },
  { key: "foreground", label: "文字" },
  { key: "muted", label: "弱文字" },
  { key: "border", label: "边框" },
  { key: "primary", label: "主色" },
  { key: "primaryForeground", label: "主色文字" },
  { key: "secondary", label: "次色" },
  { key: "accent", label: "点缀" },
  { key: "success", label: "成功" },
  { key: "warning", label: "警告" },
  { key: "danger", label: "危险" },
];

const TYPE_STEPS = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"] as const;

export function StyleDetail({
  seed,
  prev,
  next,
}: {
  seed: StyleSeed;
  prev: StyleSeed;
  next: StyleSeed;
}) {
  const router = useRouter();
  const category = getCategory(seed.category);
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const textContrast = contrastRatio(seed.colors.foreground, seed.colors.background);
  const buttonContrast = contrastRatio(seed.colors.primaryForeground, seed.colors.primary);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("input, textarea, select, [contenteditable=true], [data-slot=dialog-content]")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "ArrowLeft") router.push(`/styles/${prev.id}`);
      if (event.key === "ArrowRight") router.push(`/styles/${next.id}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next.id, prev.id, router]);

  useEffect(() => {
    const nodes = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (node): node is HTMLElement => node !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [seed.id]);

  return (
    <div>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-5xl px-4 pb-24">
        <header className="flex flex-col gap-4 py-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              设计范式库
            </Link>
            <span aria-hidden>/</span>
            <span>{category.name}</span>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{seed.name}</h1>
              <p className="mt-1 font-mono text-sm text-muted-foreground">{seed.nameEn}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" render={<Link href={`/styles/${prev.id}`} />}>
                <ArrowLeftIcon />
                {prev.name}
              </Button>
              <Button variant="outline" render={<Link href={`/styles/${next.id}`} />}>
                {next.name}
                <ArrowRightIcon />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary">{category.name}</Badge>
            {seed.platforms.map((platform) => (
              <Badge key={platform} variant="outline">
                {platform === "web" ? "Web" : "移动端"}
              </Badge>
            ))}
            {seed.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">{seed.summary}</p>
        </header>

        <nav aria-label="页内目录" className="sticky top-14 z-30 -mx-4 overflow-x-auto border-y bg-background/90 px-4 backdrop-blur">
          <div className="flex w-max gap-1 py-2">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={active === section.id ? "location" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  active === section.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {section.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="flex flex-col gap-14 pt-8">
          <section id="overview" className="scroll-mt-32">
            <SectionTitle title="概览" kicker="Overview" />
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-xl border p-4">
                <h3 className="mb-3 font-medium">原则</h3>
                <ul className="flex flex-col gap-2 text-sm leading-6">
                  {seed.principles.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-xl border p-4">
                <h3 className="mb-3 font-medium">适用</h3>
                <ul className="flex flex-col gap-2 text-sm leading-6">
                  {seed.useCases.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-xl border p-4">
                <h3 className="mb-3 flex items-center gap-2 font-medium">
                  <CheckIcon className="size-4 text-emerald-600" /> 要这样做
                </h3>
                <ul className="flex flex-col gap-2 text-sm leading-6">
                  {seed.dos.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-xl border p-4">
                <h3 className="mb-3 flex items-center gap-2 font-medium">
                  <XIcon className="size-4 text-red-600" /> 不要这样做
                </h3>
                <ul className="flex flex-col gap-2 text-sm leading-6">
                  {seed.donts.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Note title="Web" body={seed.platformNotes.web} />
              <Note title="移动端" body={seed.platformNotes.mobile} />
            </div>
          </section>

          <section id="preview" className="scroll-mt-32">
            <SectionTitle title="预览" kicker="Preview" />
            <Tabs defaultValue="web">
              <TabsList>
                <TabsTrigger value="web">Web</TabsTrigger>
                <TabsTrigger value="mobile">移动端</TabsTrigger>
              </TabsList>
              <TabsContent value="web" className="pt-4">
                <WebMockup seed={seed} />
              </TabsContent>
              <TabsContent value="mobile" className="pt-4">
                <MobileMockup seed={seed} />
              </TabsContent>
            </Tabs>
          </section>

          <section id="color" className="scroll-mt-32">
            <SectionTitle title="色彩" kicker="Color" />
            <div className="mb-4 flex flex-wrap gap-2">
              <ContrastBadge label="文字 / 画布" ratio={textContrast} />
              <ContrastBadge label="主按钮文字 / 主色" ratio={buttonContrast} />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {COLOR_FIELDS.map((field) => {
                const value = seed.colors[field.key];
                return (
                  <button
                    key={field.key}
                    type="button"
                    className="overflow-hidden rounded-xl border text-left focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    onClick={() => {
                      void navigator.clipboard.writeText(value).then(
                        () => toast.success(`已复制 ${value}`),
                        () => toast.error("复制失败"),
                      );
                    }}
                  >
                    <span className="block h-16 border-b" style={{ background: value }} />
                    <span className="block px-3 py-2">
                      <span className="block text-sm font-medium">{field.label}</span>
                      <span className="block truncate font-mono text-xs text-muted-foreground">{value}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section id="type" className="scroll-mt-32">
            <SectionTitle title="字体" kicker="Type" />
            <StyleScope seed={seed} className="overflow-hidden rounded-xl border">
              <div style={{ display: "grid", gap: "var(--space-stack)", padding: "var(--space-container)" }}>
                <p className="ds-display">{seed.name}</p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-title)", fontWeight: "var(--weight-emphasis)" }}>
                  {seed.nameEn}
                </p>
                <p style={{ maxWidth: "42rem" }}>{seed.summary}</p>
                <p className="ds-muted">
                  正文 {seed.typography.baseSize}px · 倍率 {seed.typography.scaleRatio} · 字距 {seed.typography.letterSpacing}
                </p>
                <div style={{ display: "grid", gap: "var(--space-inline)" }}>
                  {TYPE_STEPS.map((step) => (
                    <p key={step} style={{ fontSize: `var(--size-${step})`, fontFamily: "var(--font-body)" }}>
                      <span className="ds-muted" style={{ marginRight: "var(--space-inline)" }}>
                        {step}
                      </span>
                      设计范式 Aa
                    </p>
                  ))}
                </div>
                <p style={{ fontFamily: "var(--font-code)" }}>const color = var(--fg-primary);</p>
              </div>
            </StyleScope>
          </section>

          <section id="shape" className="scroll-mt-32">
            <SectionTitle title="形状与阴影" kicker="Shape" />
            <StyleScope seed={seed} className="rounded-xl border p-4">
              <div className="grid gap-4 sm:grid-cols-4">
                {(
                  [
                    ["sm", "var(--radius-sm)"],
                    ["md", "var(--radius-md)"],
                    ["lg", "var(--radius-lg)"],
                    ["full", "var(--radius-full)"],
                  ] as const
                ).map(([label, radius]) => (
                  <div key={label}>
                    <div
                      style={{
                        height: "5rem",
                        borderRadius: radius,
                        background: "var(--bg-surface)",
                        border: "var(--border-width) solid var(--border-default)",
                        boxShadow: "var(--shadow-subtle)",
                      }}
                    />
                    <p className="ds-muted" style={{ marginTop: "var(--space-inline)" }}>
                      {label} {radius === "var(--radius-sm)" ? seed.shape.radiusSm : label === "md" ? seed.shape.radiusMd : label === "lg" ? seed.shape.radiusLg : seed.shape.radiusFull}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {(
                  [
                    ["sm", "var(--shadow-sm)"],
                    ["md", "var(--shadow-md)"],
                    ["lg", "var(--shadow-lg)"],
                  ] as const
                ).map(([label, shadow]) => (
                  <div
                    key={label}
                    style={{
                      minHeight: "5rem",
                      borderRadius: "var(--radius-surface)",
                      background: "var(--bg-surface)",
                      boxShadow: shadow,
                      border: "var(--border-width-control) solid var(--border-default)",
                      padding: "var(--space-container)",
                    }}
                  >
                    <p>阴影 {label}</p>
                    <p className="ds-muted">描边 {seed.shape.borderWidth}</p>
                  </div>
                ))}
              </div>
            </StyleScope>
          </section>

          <section id="components" className="scroll-mt-32">
            <SectionTitle title="组件" kicker="Components" />
            <StyleScope seed={seed} className="rounded-xl border">
              <div style={{ display: "grid", gap: "var(--space-stack)", padding: "var(--space-container)" }}>
                <div className="flex flex-wrap" style={{ gap: "var(--space-inline)" }}>
                  <button type="button" className="ds-btn ds-btn-primary">主按钮</button>
                  <button type="button" className="ds-btn ds-btn-secondary">次按钮</button>
                  <button type="button" className="ds-btn" disabled>禁用</button>
                  <span className="ds-badge">徽章</span>
                </div>
                <label className="sr-only" htmlFor={`component-input-${seed.id}`}>示例输入</label>
                <input id={`component-input-${seed.id}`} className="ds-input" placeholder="输入一些文字" readOnly />
                <article className="ds-card">
                  <h3 className="ds-title" style={{ fontSize: "var(--text-body)" }}>卡片</h3>
                  <p className="ds-muted" style={{ marginTop: "var(--space-inline)" }}>表面、圆角和阴影都来自组件 token。</p>
                </article>
                <div style={{ borderRadius: "var(--list-radius)", overflow: "hidden", border: "var(--list-border-width) solid var(--list-divider)" }}>
                  <div className="ds-list-row"><span>列表项</span><span style={{ color: "var(--list-muted)" }}>辅助</span></div>
                  <div className="ds-list-row"><span>另一行</span><span style={{ color: "var(--list-muted)" }}>详情</span></div>
                </div>
                <div className="ds-dialog">
                  <h3 className="ds-title" style={{ fontSize: "var(--text-body)" }}>对话框</h3>
                  <p style={{ color: "var(--dialog-muted)", marginTop: "var(--space-inline)" }}>遮罩使用 dialog-overlay。</p>
                </div>
              </div>
            </StyleScope>
          </section>

          <section id="tokens" className="scroll-mt-32">
            <SectionTitle title="Token" kicker="Tokens" />
            <TokenPanel seed={seed} />
          </section>

          <section id="export" className="scroll-mt-32">
            <SectionTitle title="导出" kicker="Export" />
            <ExportPanel seed={seed} />
          </section>
        </div>
      </main>
    </div>
  );
}

function SectionTitle({ title, kicker }: { title: string; kicker: string }) {
  return (
    <div className="mb-4">
      <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">{kicker}</p>
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
  );
}

function Note({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-xl border p-4">
      <h3 className="mb-2 font-medium">{title}</h3>
      <p className="text-sm leading-6 text-muted-foreground">{body}</p>
    </article>
  );
}

function ContrastBadge({ label, ratio }: { label: string; ratio: number | null }) {
  const level = wcagLevel(ratio);
  const text = ratio === null ? "无法计算" : `${ratio.toFixed(2)}:1`;
  const passed = level === "AA" || level === "AAA";
  return (
    <Badge variant={passed ? "secondary" : "outline"}>
      {label} {text} {passed ? "AA" : level === "AA Large" ? "仅大字 AA" : "对比不足"}
    </Badge>
  );
}
