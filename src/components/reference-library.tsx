"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "./site-header";
import catalog from "@/lib/styles/sources/ui-ux-pro-max/catalog.json";
import { findStyleByUpstreamId, PRO_MAX_META } from "@/lib/styles/promax/recommend";
import { appleReferenceIndex, appleSource } from "@/lib/styles/specification";

const source = `${catalog.repository}/blob/${catalog.revision}/src/ui-ux-pro-max/data`;

export function ReferenceLibrary() {
  const [domain, setDomain] = useState("styles");
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("active");
  const needle = query.trim().toLowerCase();
  const styles = catalog.styles.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().includes(needle) &&
      (status === "all" || item.Status === status),
  );
  const rules = catalog.rules.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().includes(needle) &&
      (platform === "all" ||
        (platform === "web" ? /web|all/i : /mobile|ios|android|native|all/i).test(item.Platform)),
  );
  const pages = appleReferenceIndex.entries.filter((item) =>
    `${item.title} ${item.group}`.toLowerCase().includes(needle),
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div>
          <p className="text-xs tracking-wider text-muted-foreground uppercase">Reference Library</p>
          <h1 className="mt-2 text-2xl font-semibold">设计规范参考库</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Apple Design Skill 提供平台规范与审核方法；UI UX Pro Max 的 79 个风格已映射进首页画廊（分类「UI UX Pro Max」）并可按产品类型推荐。此处保留原文目录，便于核对来源。
          </p>
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <a
            className="rounded-xl border p-4 hover:bg-muted"
            href={appleReferenceIndex.repository}
            target="_blank"
            rel="noreferrer"
          >
            <strong>Apple Design Skill</strong>
            <p className="mt-1 text-muted-foreground">
              {appleReferenceIndex.entries.length} 篇参考索引 · 版本 {appleReferenceIndex.revision.slice(0, 7)}
            </p>
          </a>
          <a className="rounded-xl border p-4 hover:bg-muted" href={PRO_MAX_META.repository} target="_blank" rel="noreferrer">
            <strong>UI UX Pro Max 原文</strong>
            <p className="mt-1 text-muted-foreground">
              {PRO_MAX_META.styleCount} 风格 · {catalog.rules.length} 条 UX / App 规则 · MIT
            </p>
          </a>
          <Link className="rounded-xl border p-4 hover:bg-muted" href="/recommend">
            <strong>产品风格推荐</strong>
            <p className="mt-1 text-muted-foreground">按产品类型交叉推荐风格、配色与字体，并跳转可预览详情</p>
          </Link>
        </div>
        <div role="group" aria-label="参考资料类型" className="flex flex-wrap gap-2">
          {(
            [
              ["styles", "风格目录"],
              ["ux", "Web / 移动 UX 规则"],
              ["apple", "Apple HIG 索引"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={domain === id}
              onClick={() => {
                setDomain(id);
                setQuery("");
              }}
              className={`rounded-lg border px-4 py-2 text-sm ${domain === id ? "bg-foreground text-background" : "hover:bg-muted"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="min-w-0 flex-1 text-sm">
            搜索原文
            <input
              className="mt-1 block w-full rounded-md border bg-background p-2"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="可搜索英文名称、场景、规则关键词，如 button / SaaS / touch"
            />
          </label>
          {domain === "styles" ? (
            <label className="text-sm">
              目录状态
              <select
                className="mt-1 block rounded-md border bg-background p-2"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="active">主要风格</option>
                <option value="supplemental">补充变体</option>
                <option value="all">全部风格</option>
              </select>
            </label>
          ) : null}
          {domain === "ux" ? (
            <label className="text-sm">
              适用平台
              <select
                className="mt-1 block rounded-md border bg-background p-2"
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
              >
                <option value="all">全部平台</option>
                <option value="web">Web</option>
                <option value="mobile">移动端</option>
              </select>
            </label>
          ) : null}
        </div>
        <p role="status" className="text-sm text-muted-foreground">
          {domain === "styles" ? styles.length : domain === "ux" ? rules.length : pages.length} 条结果 ·
          画廊中的 Pro Max 预览是自动映射，落地前仍需按平台与无障碍验收。
        </p>
        {domain === "styles" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {styles.map((item) => {
              const mapped = findStyleByUpstreamId(item["Style ID"]);
              return (
                <details key={item["Style ID"]} className="rounded-xl border p-4">
                  <summary className="cursor-pointer font-medium">
                    {item["Style Category"]}
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      {item.Type} · {item.Status}
                    </span>
                  </summary>
                  <dl className="mt-4 grid gap-3 text-sm leading-6">
                    {(
                      [
                        ["适合场景", item["Best For"]],
                        ["避免场景", item["Do Not Use For"]],
                        ["关键词", item.Keywords],
                        ["颜色", item["Primary Colors"]],
                        ["动效与材质", item["Effects & Animation"]],
                        ["无障碍风险", item.Accessibility],
                        ["实现检查", item["Implementation Checklist"]],
                        ["移动适配", item["Mobile-Friendly"]],
                        ["明暗外观", `Light: ${item["Light Mode ✓"]} / Dark: ${item["Dark Mode ✓"]}`],
                      ] as const
                    ).map(([label, value]) => (
                      <div key={label}>
                        <dt className="font-medium">{label}</dt>
                        <dd className="text-muted-foreground">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    {mapped ? (
                      <Link className="underline" href={`/styles/${mapped.id}`}>
                        打开画廊预览 · {mapped.id}
                      </Link>
                    ) : null}
                    <a className="underline" href={`${source}/styles.csv`} target="_blank" rel="noreferrer">
                      查看来源 · {item["Style ID"]}
                    </a>
                  </div>
                </details>
              );
            })}
          </div>
        ) : null}
        {domain === "ux" ? (
          <div className="space-y-3">
            {rules.map((item) => (
              <details key={`${item.sourceFile}-${item.No}`} className="rounded-lg border p-4">
                <summary className="cursor-pointer text-sm font-medium">
                  {item.Issue}
                  <span className="ml-2 font-normal text-muted-foreground">
                    {item.Platform} · {item.Severity}
                  </span>
                </summary>
                <dl className="mt-4 space-y-3 text-sm leading-6">
                  {(
                    [
                      ["目的", item.Description],
                      ["应该", item.Do],
                      ["避免", item["Don't"]],
                      ["实现示例", item["Code Example Good"]],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label}>
                      <dt className="font-medium">{label}</dt>
                      <dd className="whitespace-pre-wrap break-words text-muted-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  className="mt-4 inline-block text-sm underline"
                  href={`${source}/${item.sourceFile}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  来源 · {item.Category} / #{item.No}
                </a>
              </details>
            ))}
          </div>
        ) : null}
        {domain === "apple" ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((item) => (
              <a
                className="rounded-lg border p-4 hover:bg-muted"
                key={item.file}
                href={`${appleSource}/references/hig/${item.file}`}
                target="_blank"
                rel="noreferrer"
              >
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.group}</p>
                <p className="mt-2 text-xs text-muted-foreground">镜像记录的更新：{item.upstreamUpdated}</p>
              </a>
            ))}
          </div>
        ) : null}
        <p className="border-t pt-4 text-xs leading-5 text-muted-foreground">
          UI UX Pro Max © 2024 Next Level Builder，MIT License。规范存在版本与适用范围差异：辅助功能偏好优先于装饰动效，平台组件要求优先于笼统尺寸建议。Apple 内容以官方原文为准，本项目只提供核心摘编与目录链接。
        </p>
      </main>
    </div>
  );
}
