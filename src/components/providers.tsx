"use client";

import { CommandPaletteProvider } from "@/components/command-palette";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider delay={300}>
        <CommandPaletteProvider>
          {children}
          <Toaster position="top-center" />
        </CommandPaletteProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
