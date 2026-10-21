import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function StyleNotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-start justify-center gap-4 px-6">
      <h1 className="text-3xl font-semibold">没有这个风格</h1>
      <p className="text-muted-foreground">检查地址里的 id，或者回到范式库重新选择。</p>
      <Link href="/" className={buttonVariants()}>
        返回设计范式库
      </Link>
    </main>
  );
}
