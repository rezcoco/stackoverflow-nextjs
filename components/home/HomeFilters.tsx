"use client";

import { HomePageFilters } from "@/constants/filters";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const HomeFilters = () => {
  const active = "frequent";
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          className={cn(
            "body-medium rounded-lg px-6 py-3 capitalize shadow-none bg-light-800 text-light-500 dark:bg-dark-300",
            {
              "bg-primary-100 dark:bg-dark-400 text-primary-500":
                active === item.value,
            }
          )}
          key={item.value}
          onClick={() => {}}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
