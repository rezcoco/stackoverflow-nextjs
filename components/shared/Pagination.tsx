"use client";

import React from "react";
import { formUrlQuery } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Direction = "prev" | "next";

type Props = {
  page: number;
  pathname: string;
  isNext: boolean;
};

const Pagination: React.FC<Props> = ({ page, isNext, pathname }) => {
  const searchQuery = useSearchParams();

  function handleNavigation(direction: Direction) {
    const nextPageNumber = direction === "next" ? page + 1 : page - 1;

    const newUrl = formUrlQuery({
      params: searchQuery.toString(),
      key: "page",
      value: nextPageNumber,
    });

    return `${pathname}?${newUrl}`;
  }
  return (
    <div className="flex w-full items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={handleNavigation("prev")}
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 rounded-md border px-4 py-2"
        >
          <p className="body-medium text-dark200_light800">Prev</p>
        </Link>
      )}
      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-medium text-light-900">{page}</p>
      </div>
      {isNext && (
        <Link
          href={handleNavigation("next")}
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 rounded-md border px-4 py-2"
        >
          <p className="body-medium text-dark200_light800">Next</p>
        </Link>
      )}
    </div>
  );
};

export default Pagination;
