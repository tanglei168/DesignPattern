import { StyleScope } from "@/components/preview/style-scope";
import type { StyleSeed } from "@/lib/styles/types";

const TABS = [
  { label: "首页", active: true },
  { label: "发现", active: false },
  { label: "收藏", active: false },
  { label: "我的", active: false },
];

export function MobileMockup({ seed }: { seed: StyleSeed }) {
  return (
    <div className="mx-auto w-[280px] rounded-[2rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-xl">
      <StyleScope seed={seed} className="flex h-[540px] flex-col overflow-hidden rounded-[1.35rem]">
        <div
          className="flex items-center justify-between"
          style={{
            padding: "0.7rem var(--space-container) 0.2rem",
            fontSize: "var(--text-caption)",
            fontWeight: "var(--weight-emphasis)",
          }}
        >
          <span>9:41</span>
          <span aria-hidden style={{ letterSpacing: "0.15em" }}>
            ●●●
          </span>
        </div>
        <div style={{ padding: "var(--space-inline) var(--space-container) 0" }}>
          <p className="ds-muted">移动端</p>
          <h3 className="ds-title">{seed.name}</h3>
        </div>
        <div style={{ padding: "var(--space-inline) var(--space-container)" }}>
          <label className="sr-only" htmlFor={`mobile-search-${seed.id}`}>
            搜索
          </label>
          <input id={`mobile-search-${seed.id}`} className="ds-input" placeholder="搜索" readOnly />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden" style={{ paddingInline: "var(--space-container)" }}>
          <div style={{ borderRadius: "var(--list-radius)", overflow: "hidden", border: "var(--list-border-width) solid var(--list-divider)" }}>
            {[
              ["设计原则", "保持 token"],
              ["组件配方", "按钮与列表"],
            ].map(([title, meta]) => (
              <div key={title} className="ds-list-row">
                <span>{title}</span>
                <span style={{ color: "var(--list-muted)", fontSize: "var(--text-caption)" }}>{meta}</span>
              </div>
            ))}
          </div>
          <article className="ds-card" style={{ marginTop: "var(--space-inline)" }}>
            <div className="flex items-center justify-between" style={{ gap: "var(--space-inline)" }}>
              <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-emphasis)" }}>今日卡片</h4>
              <span className="ds-badge">新</span>
            </div>
            <p className="ds-muted" style={{ marginTop: "var(--space-inline)" }}>
              触控目标使用 size-control。
            </p>
          </article>
        </div>
        <div style={{ padding: "var(--space-inline) var(--space-container)" }}>
          <button type="button" className="ds-btn ds-btn-primary" style={{ width: "100%" }}>
            继续
          </button>
        </div>
        <nav className="ds-tabbar" aria-label="底部标签栏">
          {TABS.map((tab) => (
            <div key={tab.label} className="ds-tab" data-active={tab.active ? "true" : "false"}>
              <span
                aria-hidden
                style={{
                  width: "0.7rem",
                  height: "0.7rem",
                  borderRadius: "var(--radius-tight)",
                  background: "currentColor",
                }}
              />
              <span>{tab.label}</span>
            </div>
          ))}
        </nav>
      </StyleScope>
    </div>
  );
}
