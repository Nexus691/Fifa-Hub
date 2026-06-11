import { Skeleton } from "@/components/ui/skeleton";

export function TeamSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-card border border-border rounded-lg">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex flex-col items-center gap-1 w-full mt-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-2 w-12" />
      </div>
    </div>
  );
}
