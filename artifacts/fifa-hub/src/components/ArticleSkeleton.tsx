import { Skeleton } from "@/components/ui/skeleton";

export function ArticleSkeleton() {
  return (
    <div className="flex gap-3 p-3 bg-card border border-border rounded-lg">
      <Skeleton className="w-16 h-16 rounded flex-shrink-0" />
      <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-2 w-16" />
          <Skeleton className="h-2 w-2" />
          <Skeleton className="h-2 w-20" />
        </div>
      </div>
    </div>
  );
}
