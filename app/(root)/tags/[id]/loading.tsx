import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section>
      <Skeleton className="h-10 w-52" />
      <div className="mb-12 mt-11 flex w-full flex-wrap justify-between gap-5">
        <Skeleton className="h-14 flex-1" />
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="background-light900_dark200 light-border h-48 w-full rounded-xl"
          />
        ))}
      </div>
    </section>
  );
};

export default Loading;
