"use client";

import { HomePageFilters } from "@/constants/filters";
import React from "react";
import { Button } from "../ui/button";
import { cn, formUrlQuery, removeFormUrlQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Filters = "newest" | "recommended" | "frequent" | "unanswered";

const HomeFilters = () => {
  const [filter, setFilter] = React.useState<Filters | null>(null);
  const searchQuery = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function handleClick(item: Filters) {
    if (item === filter) {
      setFilter(null);
      const newUrl = removeFormUrlQuery({
        params: searchQuery.toString(),
        keys: ["filter"],
      });

      router.push(`${pathname}?${newUrl}`);
    } else {
      setFilter(item);
      const newUrl = formUrlQuery({
        params: searchQuery.toString(),
        key: "filter",
        value: item,
      });
      router.push(`${pathname}?${newUrl}`);
    }
  }

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          className={cn(
            "body-medium rounded-lg px-6 py-3 capitalize shadow-none bg-light-800 text-light-500 dark:bg-dark-300",
            {
              "bg-primary-100 dark:bg-dark-400 text-primary-500":
                filter === item.value,
            }
          )}
          key={item.value}
          onClick={() => handleClick(item.value)}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
