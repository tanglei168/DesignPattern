import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-lg flex-col items-start justify-center gap-4 px-6">
      <p className="font-mono text-xs text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold">没有找到这个页面</h1>
      <p className="text-muted-foreground">风格可能不存在，或者链接写错了。回到范式库继续浏览。</p>
      <Link href="/" className={buttonVariants()}>
        返回设计范式库
      </Link>
    </main>
  );
}
