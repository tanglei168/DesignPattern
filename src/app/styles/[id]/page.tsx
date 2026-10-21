import { StyleDetail } from "@/components/style-detail/style-detail";
import { getAdjacent, getStyle, STYLES } from "@/lib/styles";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return STYLES.map((style) => ({ id: style.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const style = getStyle(id);
  if (!style) return { title: "未找到风格" };
  return {
    title: `${style.name} · ${style.nameEn}`,
    description: style.summary,
  };
}

export default async function StylePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const style = getStyle(id);
  const adjacent = getAdjacent(id);
  if (!style || !adjacent) notFound();
  return <StyleDetail seed={style} prev={adjacent.prev} next={adjacent.next} />;
}
