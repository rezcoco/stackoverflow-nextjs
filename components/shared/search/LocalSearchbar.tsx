"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type LocalSearchbarProps = {
  route: string;
  iconPosition: "left" | "right";
  imgUrl: string;
  placeholder: string;
  className?: string;
};

const LocalSearchbar: React.FC<LocalSearchbarProps> = (props) => {
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
          value=""
          onChange={() => {}}
          className="no-focus paragraph-regular background-light800_darkgradient border-none shadow-none outline-none"
        />
        {props.iconPosition === "right" && icon}
      </div>
    </div>
  );
};

export default LocalSearchbar;
