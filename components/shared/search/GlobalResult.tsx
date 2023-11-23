"use client";

import React from "react";
import GlobalFilters from "./GlobalFilters";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { globalSearch } from "@/lib/actions/general.action";

type TType = "user" | "question" | "answer" | "tag";

type TReturnResult = {
  id: string;
  type: TType;
  title: string;
};

const GlobalResult = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<Array<TReturnResult>>([]);

  const searchQuery = searchParams.get("qg");
  const typeQuery = searchParams.get("type");

  React.useEffect(() => {
    const fetchQuery = async () => {
      setIsLoading(true);
      try {
        const r = await globalSearch({
          query: searchQuery,
          type: typeQuery,
        });
        setResult(r);
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    if (searchQuery) {
      const debounce = setTimeout(fetchQuery, 500);

      return () => clearTimeout(debounce);
    }
  }, [searchQuery, typeQuery, pathname]);

  function generateLink(type: TType, id: string) {
    switch (type) {
      case "user":
        return `/profile/${id}`;
      case "answer":
        return `/question/${id}`;
      case "tag":
        return `/tags/${id}`;
      default:
        return `/${type}/${id}`;
    }
  }

  return (
    <div className="absolute z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <GlobalFilters />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-light-500/50"></div>
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <svg
              className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-dark400_light900">Browsing...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item, i) => (
                <Link
                  key={item.id + i}
                  href={generateLink(item.type, item.id)}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
                >
                  <Image
                    src="/assets/icons/tag.svg"
                    width={18}
                    height={18}
                    alt="search result"
                    className="invert-colors mt-1 object-contain"
                  />

                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-dark400_light900 text-center">
                No results found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
