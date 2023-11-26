import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section>
      <div className="flex flex-col-reverse justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="h-[140px] w-[140px] rounded-full" />
          <div className="mt-3 flex flex-col gap-4">
            <Skeleton className="h-12 w-60" />
            <Skeleton className="h-7 w-96" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h4 className="h3-bold text-dark400_light900">Stats</h4>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
          <Skeleton className="h-28 w-full rounded-xl md:h-40" />
          <Skeleton className="h-28 w-full rounded-xl md:h-40" />
          <Skeleton className="h-28 w-full rounded-xl md:h-40" />
          <Skeleton className="h-28 w-full rounded-xl md:h-40" />
        </div>
      </div>

      <div className="mt-10">
        <Skeleton className="h-10 w-44" />
        <div className="mt-5 flex flex-col gap-5">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </section>
  );
};

export default Loading;
