"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeFormUrlQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const searchParams = useSearchParams();
  const modalRef = React.useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = React.useState<string>(
    searchParams.get("qg") || ""
  );
  const [modalOpen, setModalOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    const handleClick = (e: any) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalOpen(false);
        setSearch("");
      }
    };

    setModalOpen(false);

    document.addEventListener("click", handleClick);

    return () => removeEventListener("click", handleClick);
  }, [pathname]);

  React.useEffect(() => {
    const debounce = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "qg",
          value: search,
        });

        router.push(`${pathname}?${newUrl}`);
      } else {
        const newUrl = removeFormUrlQuery({
          params: searchParams.toString(),
          keys: ["qg"],
        });

        router.push(`${pathname}?${newUrl}`);
      }
    }, 500);

    return () => clearTimeout(debounce);
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!modalOpen) setModalOpen(true);
    if (e.target.value === "" && modalOpen) setModalOpen(false);

    setSearch(e.target.value);
  }

  return (
    <div ref={modalRef} className="relative w-full max-w-[600px] max-lg:hidden">
      <div className="background-light800_darkgradient flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="search"
          className="cursor-pointer"
        />
        <Input
          type="text"
          value={search}
          onChange={handleChange}
          placeholder="Search globally"
          className="no-focus paragraph-regular text-dark400_light700 background-light800_darkgradient border-none shadow-none outline-none"
        />
      </div>
      {modalOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
