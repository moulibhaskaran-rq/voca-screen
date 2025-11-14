import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

// Futuristic gradient shimmer skeleton component
const ShimmerSkeleton = ({ className }: { className?: string }) => (
  <div className={`${className} relative overflow-hidden rounded-lg bg-gradient-to-r from-muted via-muted/60 to-muted`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" />
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan/5 to-transparent animate-shimmer" style={{ animationDelay: '0.5s' }} />
  </div>
);

export const TableSkeleton = () => {
  return (
    <Card className="overflow-hidden animate-fade-in border border-primary/20 glass backdrop-blur-xl">
      <div className="p-8 border-b border-white/10 bg-gradient-to-r from-primary/5 via-cyan/5 to-accent/5 backdrop-blur-sm relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-3">
          <ShimmerSkeleton className="h-8 w-64 rounded-xl" />
          <ShimmerSkeleton className="h-5 w-80 rounded-lg" />
        </div>
      </div>
      <div className="p-6 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl glass backdrop-blur-sm border border-white/5 hover:border-primary/20 transition-all duration-300"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <ShimmerSkeleton className="h-12 flex-1 rounded-lg" />
            <ShimmerSkeleton className="h-12 w-32 rounded-lg" />
            <ShimmerSkeleton className="h-12 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  );
};

export const StatsCardSkeleton = () => {
  const gradients = [
    'from-primary/10 to-cyan/10',
    'from-success/10 to-cyan/10',
    'from-accent/10 to-primary/10',
    'from-cyan/10 to-primary/10'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
      {[1, 2, 3, 4].map((i) => (
        <Card
          key={i}
          className="p-6 border glass backdrop-blur-xl border-primary/20 hover:shadow-glow-sm transition-all duration-500 relative overflow-hidden group rounded-3xl"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i - 1]} opacity-30 rounded-3xl`} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <ShimmerSkeleton className="h-14 w-14 rounded-xl" />
              <ShimmerSkeleton className="h-8 w-20 rounded-lg" />
            </div>
            <ShimmerSkeleton className="h-6 w-28 mb-3 rounded-lg" />
            <ShimmerSkeleton className="h-4 w-36 rounded-lg mb-4" />
            <ShimmerSkeleton className="h-1.5 w-full rounded-full" />
          </div>
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
