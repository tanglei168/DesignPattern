import { Gallery } from "@/components/gallery/gallery";
import { GallerySkeleton } from "@/components/gallery/gallery-skeleton";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense fallback={<GallerySkeleton />}>
      <Gallery />
    </Suspense>
  );
}
