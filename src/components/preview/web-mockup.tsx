import { StyleScope } from "@/components/preview/style-scope";
import type { StyleSeed } from "@/lib/styles/types";

export function WebMockup({ seed }: { seed: StyleSeed }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <span className="size-2.5 rounded-full bg-red-400/90" />
        <span className="size-2.5 rounded-full bg-amber-400/90" />
        <span className="size-2.5 rounded-full bg-emerald-400/90" />
        <div className="mx-auto hidden h-6 w-56 items-center justify-center rounded-md bg-muted text-[11px] text-muted-foreground sm:flex">
          {seed.nameEn.toLowerCase().replace(/\s+/g, "-")}.example
        </div>
      </div>
      <StyleScope seed={seed}>
        <header className="ds-nav">
          <strong style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-emphasis)" }}>
            {seed.name}
          </strong>
          <span style={{ color: "var(--nav-muted)" }}>产品</span>
          <span style={{ color: "var(--nav-active)", fontWeight: "var(--weight-emphasis)" }}>方案</span>
          <span className="hidden sm:inline" style={{ color: "var(--nav-muted)" }}>
            价格
          </span>
          <span className="ml-auto">
            <button type="button" className="ds-btn ds-btn-primary" style={{ minHeight: "2.25rem" }}>
              开始使用
            </button>
          </span>
        </header>
        <div
          style={{
            display: "grid",
            gap: "var(--space-stack)",
            padding: "var(--space-container)",
          }}
        >
          <p className="ds-muted">Web 预览 · {seed.nameEn}</p>
          <h3 className="ds-title" style={{ fontSize: "var(--size-3xl)", maxWidth: "16ch" }}>
            用这个风格做界面
          </h3>
          <p style={{ maxWidth: "46ch", color: "var(--fg-muted)" }}>{seed.summary}</p>
          <div className="flex flex-wrap items-center" style={{ gap: "var(--space-inline)" }}>
            <button type="button" className="ds-btn ds-btn-primary">
              主操作
            </button>
            <button type="button" className="ds-btn ds-btn-secondary">
              次操作
            </button>
            <span className="ds-badge">标签</span>
          </div>
          <label className="sr-only" htmlFor={`web-search-${seed.id}`}>
            搜索
          </label>
          <input id={`web-search-${seed.id}`} className="ds-input" placeholder="搜索" readOnly />
          <div className="grid sm:grid-cols-3" style={{ gap: "var(--space-inline)" }}>
            {["原则", "组件", "Token"].map((title) => (
              <article key={title} className="ds-card">
                <h4 className="ds-title" style={{ fontSize: "var(--text-body)" }}>
                  {title}
                </h4>
                <p className="ds-muted" style={{ marginTop: "var(--space-inline)" }}>
                  只用变量，不写死样式。
                </p>
              </article>
            ))}
          </div>
        </div>
      </StyleScope>
    </div>
  );
}
