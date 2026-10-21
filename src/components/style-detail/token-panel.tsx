"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { buildTokens, resolvedValue } from "@/lib/styles/tokens";
import type { DesignToken, StyleSeed, TokenTier } from "@/lib/styles/types";
import { CopyIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const TIERS: { id: TokenTier; title: string; kicker: string }[] = [
  { id: "primitive", title: "原始", kicker: "01 Primitive" },
  { id: "semantic", title: "语义", kicker: "02 Semantic" },
  { id: "component", title: "组件", kicker: "03 Component" },
];

export function TokenPanel({ seed }: { seed: StyleSeed }) {
  const tokens = useMemo(() => buildTokens(seed), [seed]);
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="sr-only" htmlFor="token-search">
          在 token 中搜索
        </label>
        <Input
          id="token-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索 token 名称、值或说明"
          autoComplete="off"
        />
      </div>
      {TIERS.map((tier) => {
        const rows = tokens[tier.id].filter((token) => {
          if (!needle) return true;
          return [token.name, token.value, token.alias ?? "", token.description, token.cssProperty, token.group]
            .join("\n")
            .toLowerCase()
            .includes(needle);
        });
        if (rows.length === 0) return null;
        return (
          <section key={tier.id} className="overflow-hidden rounded-xl border">
            <header className="flex items-baseline justify-between gap-3 border-b bg-muted/40 px-4 py-3">
              <div>
                <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">{tier.kicker}</p>
                <h3 className="font-medium">{tier.title}</h3>
              </div>
              <span className="text-xs text-muted-foreground">{rows.length}</span>
            </header>
            <div className="divide-y">
              {rows.map((token) => (
                <TokenRow key={token.name} token={token} vars={tokens.vars} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TokenRow({ token, vars }: { token: DesignToken; vars: Record<string, string> }) {
  const resolved = resolvedValue(token, vars);
  const swatch = token.type === "color" ? resolved : null;

  return (
    <div className="grid gap-2 px-4 py-3 md:grid-cols-[minmax(0,1.3fr)_auto_minmax(0,1fr)_auto] md:items-center">
      <div className="min-w-0">
        <p className="truncate font-mono text-xs">{token.name}</p>
        <p className="truncate text-xs text-muted-foreground">{token.description}</p>
      </div>
      <Badge variant="secondary" className="w-fit font-mono">
        {token.cssProperty}
      </Badge>
      <div className="flex min-w-0 items-center gap-2">
        {swatch ? (
          <span
            aria-hidden
            className="size-3.5 shrink-0 rounded-full border"
            style={{ background: swatch }}
          />
        ) : null}
        <div className="min-w-0">
          <p className="truncate font-mono text-xs">{token.value}</p>
          {token.alias ? <p className="truncate font-mono text-[11px] text-muted-foreground">{token.alias}</p> : null}
        </div>
      </div>
      <button
        type="button"
        className="inline-flex h-7 items-center gap-1 justify-self-start rounded-md border px-2 text-xs hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:justify-self-end"
        onClick={() => {
          const text = token.tier === "primitive" ? token.value : `var(${token.cssVar})`;
          void navigator.clipboard.writeText(text).then(
            () => toast.success(`已复制 ${text}`),
            () => toast.error("复制失败"),
          );
        }}
      >
        <CopyIcon className="size-3.5" />
        复制
      </button>
    </div>
  );
}
