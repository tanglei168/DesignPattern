"use client";

import { useCommandPalette } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { STYLES } from "@/lib/styles";
import { MenuIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

export function SiteHeader({ onMenu }: { onMenu?: () => void }) {
  const { open } = useCommandPalette();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-2 px-3 sm:gap-3 sm:px-4">
        {onMenu ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenu}
            aria-label="打开分类"
          >
            <MenuIcon />
          </Button>
        ) : null}
        <Link href="/" className="flex min-w-0 items-center gap-2 font-medium">
          <span className="size-2.5 shrink-0 rounded-full bg-blue-500" aria-hidden />
          <span className="truncate">
            Design Style Gallery
            <span className="hidden font-normal text-muted-foreground sm:inline"> / 设计范式库</span>
          </span>
        </Link>
        <span className="hidden shrink-0 text-sm text-muted-foreground md:inline">
          {STYLES.length} 种风格
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/recommend" className="shrink-0 rounded-md px-2 py-2 text-sm hover:bg-muted">
            Pro Max 推荐
          </Link>
          <Link href="/?cat=promax" className="hidden shrink-0 rounded-md px-2 py-2 text-sm hover:bg-muted sm:inline">
            Pro Max 风格
          </Link>
          <Link href="/references" className="shrink-0 rounded-md px-2 py-2 text-sm hover:bg-muted">
            规范库
          </Link>
          <Button type="button" variant="outline" onClick={open} aria-label="搜索风格">
            <SearchIcon />
            <span className="hidden sm:inline">搜索风格</span>
            <Kbd className="hidden md:inline-flex">⌘K</Kbd>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

