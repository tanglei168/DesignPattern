"use client";

import { MiniPreview } from "@/components/preview/mini-preview";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStyle } from "@/lib/styles";
import {
  getColorForProduct,
  getProduct,
  listProducts,
  PRO_MAX_META,
  recommendStylesForProduct,
  recommendTypography,
  type RecommendProduct,
} from "@/lib/styles/promax/recommend";
import Link from "next/link";
import { useState } from "react";

export function PromaxRecommend() {
  const products = listProducts();
  const [productNo, setProductNo] = useState(products[0]?.No ?? "1");
  const product = getProduct(productNo) ?? products[0];
  const result = product
    ? {
        styles: recommendStylesForProduct(product, 8),
        color: getColorForProduct(product["Product Type"]),
        typography: recommendTypography(product),
      }
    : null;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <header className="space-y-3">
          <p className="text-xs tracking-wider text-muted-foreground uppercase">UI UX Pro Max</p>
          <h1 className="text-3xl font-semibold tracking-tight">产品风格推荐</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            基于 upstream 的 products / colors / typography / styles 数据做交叉推荐。选出产品类型后，可直接打开对应的可预览风格详情并导出 token。
            这是设计参考引擎，不是自动生成完整设计系统。来源{" "}
            <a className="underline" href={PRO_MAX_META.repository} target="_blank" rel="noreferrer">
              ui-ux-pro-max-skill
            </a>{" "}
            · {PRO_MAX_META.styleCount} 风格 · {PRO_MAX_META.productCount} 产品类型 · MIT ·{" "}
            {PRO_MAX_META.revision.slice(0, 7)}
          </p>
        </header>

        <section className="grid gap-4 rounded-2xl border p-4 md:grid-cols-[240px_1fr]">
          <label className="text-sm">
            产品类型
            <select
              className="mt-2 block w-full rounded-lg border bg-background px-3 py-2"
              value={product?.No}
              onChange={(event) => setProductNo(event.target.value)}
            >
              {products.map((item) => (
                <option key={item.No} value={item.No}>
                  {item["Product Type"]}
                </option>
              ))}
            </select>
          </label>
          {product ? <ProductSummary product={product} /> : null}
        </section>

        {product && result ? (
          <>
            <section className="space-y-3">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">推荐风格</h2>
                  <p className="text-sm text-muted-foreground">按关键词与主/次风格建议打分，点击进入画廊详情。</p>
                </div>
                <Button variant="outline" render={<Link href="/?cat=promax" />}>
                  浏览全部 Pro Max
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {result.styles.map((item) => {
                  const seed = getStyle(item.id);
                  if (!seed) return null;
                  return (
                    <Link
                      key={item.id}
                      href={`/styles/${item.id}`}
                      className="overflow-hidden rounded-xl border transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="border-b bg-muted/30">
                        <MiniPreview seed={seed} mode={seed.platforms.includes("mobile") && !seed.platforms.includes("web") ? "mobile" : "web"} />
                      </div>
                      <div className="space-y-2 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate font-medium">{seed.name}</h3>
                            <p className="truncate font-mono text-xs text-muted-foreground">{seed.nameEn}</p>
                          </div>
                          <Badge variant="secondary">分 {item.score}</Badge>
                        </div>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{item.bestFor}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              {result.color ? (
                <article className="rounded-2xl border p-4">
                  <h2 className="text-lg font-semibold">推荐配色</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{result.color["Product Type"]}</p>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {(
                      [
                        ["Primary", result.color.Primary],
                        ["Secondary", result.color.Secondary],
                        ["Accent", result.color.Accent],
                        ["Background", result.color.Background],
                        ["Foreground", result.color.Foreground],
                        ["Card", result.color.Card],
                        ["Muted", result.color.Muted],
                        ["Border", result.color.Border],
                      ] as const
                    ).map(([label, value]) => (
                      <div key={label} className="overflow-hidden rounded-lg border">
                        <div className="h-12" style={{ background: value }} />
                        <div className="space-y-0.5 p-2">
                          <p className="text-[11px] font-medium">{label}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">{result.color.Notes}</p>
                </article>
              ) : null}

              <article className="rounded-2xl border p-4">
                <h2 className="text-lg font-semibold">推荐字体配对</h2>
                <p className="mt-1 text-sm text-muted-foreground">{result.typography["Font Pairing Name"]}</p>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">标题</dt>
                    <dd className="font-medium" style={{ fontFamily: `"${result.typography["Heading Font"]}", serif` }}>
                      {result.typography["Heading Font"]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">正文</dt>
                    <dd className="font-medium" style={{ fontFamily: `"${result.typography["Body Font"]}", sans-serif` }}>
                      {result.typography["Body Font"]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">情绪</dt>
                    <dd>{result.typography["Mood/Style Keywords"]}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">适合</dt>
                    <dd className="text-muted-foreground">{result.typography["Best For"]}</dd>
                  </div>
                </dl>
              </article>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}

function ProductSummary({ product }: { product: RecommendProduct }) {
  return (
    <div className="space-y-2 text-sm">
      <h2 className="text-lg font-semibold">{product["Product Type"]}</h2>
      <p className="text-muted-foreground">{product["Key Considerations"]}</p>
      <div className="flex flex-wrap gap-2 pt-1">
        <Badge variant="outline">主风格 {product["Primary Style Recommendation"]}</Badge>
        <Badge variant="outline">着陆页 {product["Landing Page Pattern"]}</Badge>
        {product["Dashboard Style (if applicable)"] ? (
          <Badge variant="outline">仪表盘 {product["Dashboard Style (if applicable)"]}</Badge>
        ) : null}
      </div>
    </div>
  );
}
