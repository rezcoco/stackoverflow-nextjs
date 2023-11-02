import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

type NoResultProps = {
  title: string;
  description: string;
  link: string;
  linkLabel: string;
};

const NoResult: React.FC<NoResultProps> = (props) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src="/assets/images/light-illustration.png"
        width={270}
        height={200}
        alt="no result"
        className="block object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        width={270}
        height={200}
        alt="no result"
        className="hidden object-contain dark:flex"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8">{props.title}</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md">
        {props.description}
      </p>
      <Link href={props.link}>
        <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900">
          {props.linkLabel}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
