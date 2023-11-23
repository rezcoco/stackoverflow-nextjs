"use client";

import { cn, formUrlQuery, removeFormUrlQuery } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type F = {
  name: string;
  value: string;
};

type FilterProps<T> = {
  filters: ReadonlyArray<T>;
  className?: string;
  containerClasses?: string;
};

const Filter = <T extends F>(props: FilterProps<T>) => {
  const searchQuery = useSearchParams();
  const [filter, setFilter] = React.useState(searchQuery.get("filter") || "");
  const pathname = usePathname();
  const router = useRouter();

  function onValueChange(value: string) {
    if (filter === value) {
      setFilter("");
      const newUrl = removeFormUrlQuery({
        params: searchQuery.toString(),
        keys: ["filter"],
      });

      router.push(`${pathname}?${newUrl}`, { scroll: false });
    } else {
      setFilter(value);
      const newUrl = formUrlQuery({
        params: searchQuery.toString(),
        key: "filter",
        value,
      });

      router.push(`${pathname}?${newUrl}`, { scroll: false });
    }
  }
  return (
    <div className={cn("relative", props.containerClasses)}>
      <Select onValueChange={(value) => onValueChange(value)} value={filter}>
        <SelectTrigger
          className={cn(
            "body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5 flex gap-2 items-center",
            props.className
          )}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {props.filters.map((item) => (
              <SelectItem key={item.name} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
