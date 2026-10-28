import { specificationMarkdown } from "@/lib/styles/specification";
import { toCss } from "@/lib/export/toCss";
import { toCursorRule } from "@/lib/export/toCursorRule";
import { toDtcg } from "@/lib/export/toDtcg";
import { toAgentMarkdown } from "@/lib/export/toAgentMarkdown";
import { toTailwind } from "@/lib/export/toTailwind";
import type { StyleSeed } from "@/lib/styles/types";

export const EXPORT_FILES = [
  { file: "SPECIFICATION.md", contentType: "text/markdown; charset=utf-8", label: "导出详细规范" },
  { file: "tokens.css", contentType: "text/css; charset=utf-8", label: "导出 CSS" },
  { file: "tokens.json", contentType: "application/json; charset=utf-8", label: "导出 DTCG" },
  {
    file: "tailwind.theme.css",
    contentType: "text/css; charset=utf-8",
    label: "导出 Tailwind",
  },
  { file: "DESIGN.md", contentType: "text/markdown; charset=utf-8", label: "导出 DESIGN.md" },
  {
    file: "design-style.mdc",
    contentType: "text/markdown; charset=utf-8",
    label: "导出 Cursor Rule",
  },
] as const;

export type ExportFileName = (typeof EXPORT_FILES)[number]["file"];

export function isExportFile(file: string): file is ExportFileName {
  return EXPORT_FILES.some((item) => item.file === file);
}

export function renderExport(
  seed: StyleSeed,
  file: string,
): { content: string; contentType: string; filename: string } | null {
  const match = EXPORT_FILES.find((item) => item.file === file);
  if (!match) return null;
  const content = renderExportContent(seed, match.file);
  return { content, contentType: match.contentType, filename: match.file };
}

export function renderExportContent(seed: StyleSeed, file: ExportFileName): string {
  switch (file) {
    case "SPECIFICATION.md":
      return specificationMarkdown(seed);
    case "tokens.css":
      return toCss(seed);
    case "tokens.json":
      return toDtcg(seed);
    case "tailwind.theme.css":
      return toTailwind(seed);
    case "DESIGN.md":
      return toAgentMarkdown(seed);
    case "design-style.mdc":
      return toCursorRule(seed);
  }
}

export function styleApiLinks(id: string): Record<ExportFileName, string> {
  return {
    "SPECIFICATION.md": `/api/styles/${id}/SPECIFICATION.md`,
    "tokens.css": `/api/styles/${id}/tokens.css`,
    "tokens.json": `/api/styles/${id}/tokens.json`,
    "tailwind.theme.css": `/api/styles/${id}/tailwind.theme.css`,
    "DESIGN.md": `/api/styles/${id}/DESIGN.md`,
    "design-style.mdc": `/api/styles/${id}/design-style.mdc`,
  };
}

