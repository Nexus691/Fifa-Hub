import { Skeleton } from "@/components/ui/skeleton";

export function StandingsSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="bg-primary/5 border-b border-border px-4 py-3">
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center px-3 py-2 gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="w-5 h-5 rounded-sm" />
            <Skeleton className="h-3 w-24 flex-1" />
            <Skeleton className="h-3 w-4" />
            <Skeleton className="h-4 w-5" />
          </div>
        ))}
      </div>
    </div>
  );
}
