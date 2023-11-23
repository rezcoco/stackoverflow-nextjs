"use client";

import { GlobalSearchFilters } from "@/constants/filters";
import { cn, formUrlQuery, removeFormUrlQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const GlobalFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const typeParams = searchParams.get("type");
  const [activeType, setActiveType] = React.useState(typeParams || "");

  function handleClick(value: string) {
    const currentActiveType = searchParams.get("type");
    if (value === currentActiveType) {
      setActiveType("");
      const newUrl = removeFormUrlQuery({
        params: searchParams.toString(),
        keys: ["type"],
      });

      router.push(`${pathname}?${newUrl}`);
    } else {
      setActiveType(value);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value,
      });

      router.push(`${pathname}?${newUrl}`);
    }
  }
  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type: </p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((filter) => (
          <button
            key={filter.name}
            type="button"
            onClick={() => handleClick(filter.value)}
            className={cn(
              "small-medium light-border-2 rounded-2xl bg-light-700 px-5 py-2 capitalize text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-800 dark:hover:text-primary-500",
              {
                "bg-primary-500 text-light-800 hover hover:text-light-800 hover:bg-primary-500/50 dark:bg-primary-500 dark:hover:text-light-800 dark:hover:bg-primary-500/50":
                  activeType === filter.value,
              }
            )}
          >
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
