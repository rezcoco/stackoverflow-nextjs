import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type MetricProps = {
  imgUrl: string;
  alt: string;
  value: number | string;
  title: string;
  href?: string;
  className?: string;
  isAuthor?: boolean;
};

const Metric: React.FC<MetricProps> = (props) => {
  const MetricContent = (
    <>
      <Image
        src={props.imgUrl}
        alt={props.alt}
        height={16}
        width={16}
        className={cn("object-contain invert-colors", {
          "rounded-full": props.href,
        })}
      />
      <p className={cn("flex items-center gap-1", props.className)}>
        {props.value}{" "}
        <span
          className={cn("small-regular line-clamp-1", {
            "max-sm:hidden": props.isAuthor,
          })}
        >
          {props.title}
        </span>
      </p>
    </>
  );

  if (props.href) {
    return (
      <Link className="flex-center gap-1" href={props.href}>
        {MetricContent}
      </Link>
    );
  }

  return <div className="flex-center flex-wrap gap-1">{MetricContent}</div>;
};

export default Metric;
