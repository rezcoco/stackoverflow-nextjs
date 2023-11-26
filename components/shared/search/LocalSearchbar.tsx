"use client";

import { Input } from "@/components/ui/input";
import { cn, formUrlQuery, removeFormUrlQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React from "react";

type LocalSearchbarProps = {
  route: string;
  iconPosition: "left" | "right";
  imgUrl: string;
  placeholder: string;
  className?: string;
};

const LocalSearchbar: React.FC<LocalSearchbarProps> = (props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q");
  const [search, setSearch] = React.useState(query || "");

  React.useEffect(() => {
    const debounce = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });

        router.push(`${pathname}?${newUrl}`, { scroll: false });
      } else {
        const newUrl = removeFormUrlQuery({
          params: searchParams.toString(),
          keys: ["q"],
        });

        router.push(`${pathname}?${newUrl}`);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [search, pathname, router, searchParams, props.route]);

  const icon = (
    <Image
      src={props.imgUrl}
      width={24}
      height={24}
      alt="search icon"
      className="cursor-pointer"
    />
  );

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "background-light800_darkgradient flex min-h-[56px] grow items-center gap-1 rounded-[10px] px-4",
          props.className
        )}
      >
        {props.iconPosition === "left" && icon}
        <Input
          type="text"
          placeholder={props.placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="no-focus paragraph-regular text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />
        {props.iconPosition === "right" && icon}
      </div>
    </div>
  );
};

export default LocalSearchbar;
