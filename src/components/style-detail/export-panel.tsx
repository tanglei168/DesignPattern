"use client";

import { Button } from "@/components/ui/button";
import { EXPORT_FILES, renderExportContent } from "@/lib/export/files";
import { buildZip, kitFilename } from "@/lib/export/buildZip";
import { toAgentPrompt } from "@/lib/export/toAgentMarkdown";
import { toAgentsSnippet } from "@/lib/export/toCursorRule";
import type { StyleSeed } from "@/lib/styles/types";
import { CopyIcon, DownloadIcon } from "lucide-react";
import { useSyncExternalStore } from "react";
import { toast } from "sonner";

function useOrigin() {
  return useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );
}

export function ExportPanel({ seed }: { seed: StyleSeed }) {
  const origin = useOrigin();

  const base = `${origin}/api/styles/${seed.id}`;
  const curls = [
    `curl -fsSL ${base}/DESIGN.md`,
    `curl -fsSL ${base}/tokens.css -o design/tokens.css`,
    `curl -fsSL ${base}/tokens.json -o design/tokens.json`,
    `curl -fsSL ${base}/tailwind.theme.css -o design/tailwind.theme.css`,
    `curl -fsSL ${base}/design-style.mdc -o .cursor/rules/design-style.mdc`,
  ].join("\n");
  const agents = toAgentsSnippet(seed);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {EXPORT_FILES.map((file) => (
          <Button
            key={file.file}
            type="button"
            variant="outline"
            onClick={() => {
              downloadText(file.file, renderExportContent(seed, file.file), file.contentType);
              toast.success(`已下载 ${file.file}`);
            }}
          >
            <DownloadIcon />
            {file.label}
          </Button>
        ))}
        <Button
          type="button"
          onClick={() => {
            void buildZip(seed).then((blob) => {
              downloadBlob(kitFilename(seed), blob);
              toast.success(`已下载 ${kitFilename(seed)}`);
            });
          }}
        >
          <DownloadIcon />
          下载完整套件 (.zip)
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            void copy(toAgentPrompt(seed), "已复制 Agent 提示词");
          }}
        >
          <CopyIcon />
          复制 Agent 提示词
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border">
        <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-4 py-2">
          <p className="text-sm font-medium">给代理的接口</p>
          <Button type="button" variant="ghost" size="sm" onClick={() => void copy(`${curls}\n\n${agents}`, "已复制接入命令")}>
            <CopyIcon />
            复制
          </Button>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-xs leading-6">
          <code>{`${curls}\n\n# 写入 AGENTS.md\n${agents}`}</code>
        </pre>
      </div>
      <p className="text-sm text-muted-foreground">
        把 zip 里的 <code className="font-mono">design/tokens.css</code> 引入项目，并让代理先读{" "}
        <code className="font-mono">design/DESIGN.md</code>。Cursor 规则放在{" "}
        <code className="font-mono">.cursor/rules/design-style.mdc</code>，<code className="font-mono">alwaysApply</code> 为 true。
      </p>
    </div>
  );
}

function downloadText(filename: string, content: string, type: string) {
  downloadBlob(filename, new Blob([content], { type }));
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

async function copy(text: string, success: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(success);
  } catch {
    toast.error("复制失败");
  }
}
