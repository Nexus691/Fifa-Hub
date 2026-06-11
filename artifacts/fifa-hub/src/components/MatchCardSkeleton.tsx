import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MatchCardSkeleton() {
  return (
    <Card className="flex flex-col p-4 gap-4 border-border bg-card/30 backdrop-blur">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-8 rounded-full" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-col items-center gap-2 w-[40%]">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>

        <div className="flex flex-col items-center justify-center w-[20%] min-w-[60px]">
          <Skeleton className="h-8 w-12" />
        </div>

        <div className="flex flex-col items-center gap-2 w-[40%]">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="flex justify-center items-center gap-1 border-t border-border pt-3">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-32" />
      </div>
    </Card>
  );
}
