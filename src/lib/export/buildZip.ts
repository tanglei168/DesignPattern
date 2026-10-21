import JSZip from "jszip";
import { renderExportContent } from "@/lib/export/files";
import { toAgentsSnippet } from "@/lib/export/toCursorRule";
import type { StyleSeed } from "@/lib/styles/types";

export function kitFilename(seed: StyleSeed): string {
  return `${seed.id}-design-kit.zip`;
}

export async function buildZip(seed: StyleSeed): Promise<Blob> {
  const zip = new JSZip();
  zip.file("design/tokens.css", renderExportContent(seed, "tokens.css"));
  zip.file("design/tokens.json", renderExportContent(seed, "tokens.json"));
  zip.file("design/tailwind.theme.css", renderExportContent(seed, "tailwind.theme.css"));
  zip.file("design/DESIGN.md", renderExportContent(seed, "DESIGN.md"));
  zip.file(".cursor/rules/design-style.mdc", renderExportContent(seed, "design-style.mdc"));
  zip.file("AGENTS.snippet.md", toAgentsSnippet(seed));
  return zip.generateAsync({ type: "blob" });
}
