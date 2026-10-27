import { EXPORT_FILES, isExportFile, renderExport } from "@/lib/export/files";
import { getStyle, STYLES } from "@/lib/styles";

const FILES = EXPORT_FILES.map(item => item.file);

export function generateStaticParams() {
  return STYLES.flatMap((style) => FILES.map((file) => ({ id: style.id, file })));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; file: string }> },
) {
  const { id, file } = await params;
  const style = getStyle(id);
  if (!style || !isExportFile(file)) {
    return new Response("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const rendered = renderExport(style, file);
  if (!rendered) {
    return new Response("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(rendered.content, {
    headers: {
      "Content-Type": rendered.contentType,
      "Content-Disposition": `inline; filename="${rendered.filename}"`,
    },
  });
}

