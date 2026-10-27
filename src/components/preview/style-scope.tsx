import { effectStyles } from "@/lib/styles/effects";
import { buildTokens } from "@/lib/styles/tokens";
import type { StyleSeed } from "@/lib/styles/types";
import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

export function StyleScope({
  seed,
  className,
  children,
  style,
  platform,
}: {
  seed: StyleSeed;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
  platform?: "web" | "mobile";
}) {
  const { vars } = buildTokens(seed);

  return (
    <div
      data-style={seed.id}
      data-platform={platform}
      className={cn("style-scope", className)}
      style={{
        ...vars,
        ...(seed.id === "shigan-b" && platform === "mobile" ? {"--size-control-base":"44px", "--color-background":"var(--shigan-mobile-page)"} : {}),
        ...effectStyles(seed),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

