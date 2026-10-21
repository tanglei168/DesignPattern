"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CATEGORIES } from "@/lib/styles/categories";
import { STYLES } from "@/lib/styles";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type CommandPaletteContextValue = {
  open: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  open: () => {},
});

export function useCommandPalette() {
  return useContext(CommandPaletteContext);
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const value = useMemo(() => ({ open: () => setOpened(true) }), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpened((current) => !current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandDialog
        open={opened}
        onOpenChange={setOpened}
        title="搜索设计风格"
        description="按名称、英文名或关键词跳转到风格详情"
        className="sm:max-w-xl"
      >
        <Command>
          <CommandInput placeholder="搜索设计风格…" />
          <CommandList>
            <CommandEmpty>没有匹配的风格</CommandEmpty>
            {CATEGORIES.map((category) => (
              <CommandGroup key={category.id} heading={`${category.name} · ${category.nameEn}`}>
                {STYLES.filter((style) => style.category === category.id).map((style) => (
                  <CommandItem
                    key={style.id}
                    value={`${style.name} ${style.nameEn} ${style.id} ${style.tags.join(" ")} ${style.keywords.join(" ")}`}
                    onSelect={() => {
                      setOpened(false);
                      router.push(`/styles/${style.id}`);
                    }}
                  >
                    <span>{style.name}</span>
                    <span className="text-xs text-muted-foreground">{style.nameEn}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </CommandPaletteContext.Provider>
  );
}
