import { Skeleton } from "@heroui/react";

export default function SkeletonContent() {
  return (
    <div className="w-full flex-1 space-y-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-5 w-30 rounded-lg" />
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}