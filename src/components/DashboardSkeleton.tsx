import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 animate-pulse" aria-label="Loading character dashboard">
      {/* 1. Player Header Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:p-6 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-slate-800 border border-slate-700/80" />
            <div className="space-y-2">
              <div className="h-6 w-36 bg-slate-800 rounded-md" />
              <div className="h-4 w-48 bg-slate-800/60 rounded-md" />
            </div>
          </div>

          <div className="w-full lg:max-w-md flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-slate-800 rounded" />
              <div className="h-3 w-20 bg-slate-800 rounded" />
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-24 bg-slate-800 rounded-xl" />
            <div className="h-10 w-24 bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>

      {/* 2. Stat Cards Skeleton */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1.5">
            <div className="h-3 w-24 bg-slate-800 rounded" />
            <div className="h-6 w-44 bg-slate-800 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="w-9 h-9 rounded-xl bg-slate-800" />
                <div className="h-4 w-12 bg-slate-800 rounded" />
              </div>
              <div className="h-4 w-28 bg-slate-800 rounded" />
              <div className="h-2 w-full bg-slate-800 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Two-Column Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-3">
          <div className="h-6 w-36 bg-slate-800 rounded mb-4" />
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-20 rounded-2xl border border-slate-800 bg-slate-900/80"
            />
          ))}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="h-40 rounded-2xl border border-slate-800 bg-slate-900/80" />
          <div className="h-48 rounded-2xl border border-slate-800 bg-slate-900/80" />
        </div>
      </div>
    </div>
  );
};
