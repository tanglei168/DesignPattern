import { StyleScope } from "@/components/preview/style-scope";
import type { Platform, StyleSeed } from "@/lib/styles/types";

export function MiniPreview({
  seed,
  mode = "web",
}: {
  seed: StyleSeed;
  mode?: Platform | "all";
}) {
  const mobile = mode === "mobile";

  return (
    <div
      className={
        mobile
          ? "flex aspect-video w-full items-center justify-center bg-zinc-200/80 p-3 dark:bg-zinc-800/60"
          : "aspect-video w-full overflow-hidden"
      }
    >
      {mobile ? (
        <div className="h-full w-[46%] overflow-hidden rounded-[1.1rem] border-[5px] border-zinc-900 bg-zinc-900 shadow-md">
          <StyleScope seed={seed} className="flex h-full flex-col">
            <PreviewChrome mobile />
          </StyleScope>
        </div>
      ) : (
        <StyleScope seed={seed} className="flex h-full flex-col">
          <div
            className="flex items-center gap-1.5 border-b"
            style={{
              borderColor: "var(--border-default)",
              background: "var(--bg-surface-alt)",
              padding: "0.35rem 0.55rem",
            }}
          >
            <span aria-hidden className="size-1.5 rounded-full" style={{ background: "var(--color-danger)" }} />
            <span aria-hidden className="size-1.5 rounded-full" style={{ background: "var(--color-warning)" }} />
            <span aria-hidden className="size-1.5 rounded-full" style={{ background: "var(--color-success)" }} />
            <span
              className="ml-1 min-w-0 flex-1 truncate rounded px-1.5 text-[10px]"
              style={{
                background: "var(--bg-surface)",
                color: "var(--fg-muted)",
                border: "1px solid var(--border-default)",
              }}
            >
              {seed.id}.example
            </span>
          </div>
          <PreviewChrome />
        </StyleScope>
      )}
    </div>
  );
}

function PreviewChrome({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      className="flex min-h-0 flex-1 items-center"
      style={{
        gap: "var(--space-inline)",
        padding: mobile ? "0.55rem" : "var(--space-container)",
      }}
    >
      <span
        aria-hidden
        className="shrink-0"
        style={{
          width: mobile ? "1.65rem" : "2.25rem",
          height: mobile ? "1.65rem" : "2.25rem",
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
          width: mobile ? "1.65rem" : "2.25rem",
          height: mobile ? "1.65rem" : "2.25rem",
          borderRadius: "var(--radius-control)",
          background: "var(--bg-surface-alt)",
          boxShadow: "var(--shadow-subtle)",
          border: "var(--border-width-control) solid var(--border-default)",
        }}
      />
      <div
        className="ds-search min-w-0 flex-1"
        style={{ height: mobile ? "1.65rem" : "2.25rem" }}
      >
        <span className="min-w-0 flex-1 truncate">{mobile ? "搜" : "搜索"}</span>
        {!mobile ? (
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
        ) : null}
      </div>
    </div>
  );
}
