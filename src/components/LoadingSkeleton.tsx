import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

// Premium shimmer skeleton component
const ShimmerSkeleton = ({ className }: { className?: string }) => (
  <Skeleton
    className={`${className} relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-shimmer`}
  />
);

export const TableSkeleton = () => {
  return (
    <Card className="overflow-hidden animate-fade-in border-2">
      <div className="p-6 border-b border-border bg-gradient-to-r from-muted/50 to-transparent">
        <ShimmerSkeleton className="h-6 w-48 mb-3 rounded-lg" />
        <ShimmerSkeleton className="h-4 w-64 rounded-lg" />
      </div>
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 group hover:bg-muted/30 p-3 rounded-lg transition-all duration-300"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <ShimmerSkeleton className="h-14 flex-1 rounded-lg group-hover:shadow-glow-sm transition-all" />
            <ShimmerSkeleton className="h-14 w-32 rounded-lg" />
            <ShimmerSkeleton className="h-14 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  );
};

export const StatsCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
      {[1, 2, 3, 4].map((i) => (
        <Card
          key={i}
          className="p-6 border-2 hover:shadow-glow-sm transition-all duration-300"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <ShimmerSkeleton className="h-12 w-12 rounded-xl" />
            <ShimmerSkeleton className="h-6 w-16 rounded-lg" />
          </div>
          <ShimmerSkeleton className="h-8 w-20 mb-3 rounded-lg" />
          <ShimmerSkeleton className="h-4 w-32 rounded-lg" />
        </Card>
      ))}
    </div>
  );
};

export const DetailPageSkeleton = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header skeleton */}
      <Card className="p-8 border-2">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <ShimmerSkeleton className="h-10 w-48 mb-4 rounded-lg" />
            <ShimmerSkeleton className="h-6 w-64 mb-3 rounded-lg" />
            <ShimmerSkeleton className="h-4 w-40 rounded-lg" />
          </div>
          <ShimmerSkeleton className="h-24 w-32 rounded-2xl" />
        </div>
      </Card>

      {/* Contact info skeleton */}
      <Card className="p-6 border-2">
        <ShimmerSkeleton className="h-6 w-32 mb-4 rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <ShimmerSkeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </Card>

      {/* Link skeleton */}
      <Card className="p-6 border-2">
        <ShimmerSkeleton className="h-6 w-32 mb-4 rounded-lg" />
        <ShimmerSkeleton className="h-12 w-full rounded-lg" />
      </Card>

      {/* Summary skeleton */}
      <Card className="p-6 border-2 border-l-4 border-l-success">
        <ShimmerSkeleton className="h-6 w-32 mb-4 rounded-lg" />
        <div className="space-y-2">
          <ShimmerSkeleton className="h-4 w-full rounded-lg" />
          <ShimmerSkeleton className="h-4 w-full rounded-lg" />
          <ShimmerSkeleton className="h-4 w-3/4 rounded-lg" />
        </div>
      </Card>

      {/* Transcript skeleton */}
      <Card className="p-6 border-2">
        <ShimmerSkeleton className="h-6 w-40 mb-4 rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <ShimmerSkeleton key={i} className="h-4 w-full rounded-lg" />
          ))}
        </div>
      </Card>

      {/* Actions skeleton */}
      <Card className="p-6 border-2">
        <div className="flex gap-4">
          <ShimmerSkeleton className="h-12 flex-1 rounded-lg" />
          <ShimmerSkeleton className="h-12 flex-1 rounded-lg" />
        </div>
      </Card>
    </div>
  );
};
