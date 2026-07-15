import { Card, Skeleton } from "@heroui/react";

export default function SkeletonContent() {
  return (
    <div className="w-full flex-1 space-y-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="h-5 w-30 rounded-lg" />
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-36 rounded-lg" />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-5 w-10 rounded-lg" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-md space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}