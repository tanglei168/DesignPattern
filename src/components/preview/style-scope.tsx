import { buildTokens } from "@/lib/styles/tokens";
import type { StyleSeed } from "@/lib/styles/types";
import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

export function StyleScope({
  seed,
  className,
  children,
  style,
}: {
  seed: StyleSeed;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const { vars } = buildTokens(seed);
  const layers: string[] = [];
  if (seed.effects?.noise) {
    layers.push("radial-gradient(rgba(127, 127, 127, 0.28) 0.6px, transparent 0.7px)");
  }
  if (seed.effects?.backgroundImage) {
    layers.push(seed.effects.backgroundImage);
  }

  return (
    <div
      className={cn("style-scope", className)}
      style={{
        ...vars,
        backgroundImage: layers.length > 0 ? layers.join(", ") : undefined,
        backgroundSize: seed.effects?.noise
          ? seed.effects.backgroundImage
            ? "3px 3px, auto"
            : "3px 3px"
          : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
