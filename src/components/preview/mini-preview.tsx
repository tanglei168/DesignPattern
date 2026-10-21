import { StyleScope } from "@/components/preview/style-scope";
import type { StyleSeed } from "@/lib/styles/types";

export function MiniPreview({ seed }: { seed: StyleSeed }) {
  return (
    <StyleScope seed={seed} className="aspect-video w-full overflow-hidden">
      <div
        className="flex h-full items-center"
        style={{ gap: "var(--space-inline)", padding: "var(--space-container)" }}
      >
        <span
          aria-hidden
          className="shrink-0"
          style={{
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "var(--radius-pill)",
            background: "var(--action-primary)",
            boxShadow: "var(--shadow-subtle)",
            border: "var(--border-width-control) solid var(--border-default)",
          }}
        />
        <span
          aria-hidden
          className="shrink-0"
          style={{
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "var(--radius-control)",
            background: "var(--bg-surface-alt)",
            boxShadow: "var(--shadow-subtle)",
            border: "var(--border-width-control) solid var(--border-default)",
          }}
        />
        <div className="ds-search min-w-0 flex-1" style={{ height: "2.25rem" }}>
          <span className="min-w-0 flex-1 truncate">搜索</span>
          <span
            className="shrink-0"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: "1.6rem",
              paddingInline: "var(--space-inline)",
              borderRadius: "var(--button-radius)",
              background: "var(--button-bg)",
              color: "var(--button-fg)",
              border: "var(--button-border-width) solid var(--button-border)",
              boxShadow: "var(--button-shadow)",
              fontFamily: "var(--button-font)",
              fontSize: "var(--text-caption)",
              fontWeight: "var(--button-weight)",
            }}
          >
            搜索
          </span>
        </div>
      </div>
    </StyleScope>
  );
}
