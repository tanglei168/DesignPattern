"use client";

import { useState } from "react";
import { getDesignSpec, SPEC_SECTIONS, appleReferenceIndex, appleSource } from "@/lib/styles/specification";
import type { StyleSeed } from "@/lib/styles/types";

export function SpecificationPanel({ seed }: { seed: StyleSeed }) {
  const spec = getDesignSpec(seed);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const rules = spec.rules.filter(rule => JSON.stringify(rule).toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="space-y-5">
    <div className="rounded-xl border bg-muted/30 p-4 text-sm leading-6">
      <p className="font-medium">{spec.level} · {spec.rules.length} 条 · 实现待验收</p>
      <p className="mt-1 text-muted-foreground">{spec.scope}</p>
    </div>
    <div className="flex flex-wrap gap-3">
      <label className="min-w-0 flex-1 text-sm">搜索规则<input className="mt-1 block w-full rounded-md border bg-background p-2" value={query} onChange={e => setQuery(e.target.value)} placeholder="按钮、字体、状态、验收…" /></label>
      <label className="text-sm">平台<select className="mt-1 block rounded-md border bg-background p-2" value={platform} onChange={e => setPlatform(e.target.value)}><option value="all">两端对照</option><option value="web">Web / 桌面</option><option value="mobile">移动端</option></select></label>
    </div>
    <p role="status" className="text-sm text-muted-foreground">找到 {rules.length} 条规则。展开查看组成、状态、禁止事项和验收方法。</p>
    {SPEC_SECTIONS.map(section => {
      const items = rules.filter(rule => rule.section === section);
      if (!items.length) return null;
      return <div key={section} className="space-y-2"><h3 className="font-semibold">{section}</h3>{items.map(rule => <details key={rule.id} className="rounded-lg border p-4">
        <summary className="cursor-pointer text-sm font-medium">{rule.title}<span className="ml-2 text-xs font-normal text-muted-foreground">{rule.severity}</span></summary>
        <dl className="mt-4 grid gap-4 text-sm leading-6">
          {[["目的与场景", rule.purpose], ["组成与参数", rule.anatomy], ...(platform !== "mobile" ? [["Web / 桌面", rule.web]] : []), ...(platform !== "web" ? [["移动端", rule.mobile]] : []), ["完整状态", rule.states], ["禁止事项", rule.avoid], ["验收方法", rule.acceptance]].map(([name, value]) => <div key={name}><dt className="font-medium">{name}</dt><dd className="mt-1 text-muted-foreground">{value}</dd></div>)}
          <div><dt className="font-medium">依据与适用边界</dt><dd className="text-muted-foreground">{rule.basis}{rule.source && <> · <a href={rule.source} target="_blank" rel="noreferrer" className="underline underline-offset-4">{rule.sourceHeading ?? "查看来源"}</a></>}</dd></div>
        </dl>
      </details>)}</div>;
    })}
    {seed.id === "apple-hig" && <details className="rounded-lg border p-4"><summary className="cursor-pointer text-sm font-medium">Apple 参考目录 · {appleReferenceIndex.entries.length} 篇</summary><p className="my-3 text-sm text-muted-foreground">仅目录收录，不表示逐篇复核。固定来源版本 {appleReferenceIndex.revision.slice(0, 7)}。</p><ul className="grid gap-2 text-sm sm:grid-cols-2">{appleReferenceIndex.entries.map(entry => <li key={entry.file}><a className="underline underline-offset-4" target="_blank" rel="noreferrer" href={`${appleSource}/references/hig/${entry.file}`}>{entry.title}</a><span className="block text-xs text-muted-foreground">{entry.group}</span></li>)}</ul></details>}
  </div>;
}
