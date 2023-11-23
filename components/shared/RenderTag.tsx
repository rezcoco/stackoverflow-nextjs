import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { TTagDoc } from "@/database/tag.model";

type RenderTagProps = {
  tag: Partial<TTagDoc>;
  showCount?: boolean;
  totalQuestions?: number;
};

const RenderTag: React.FC<RenderTagProps> = ({
  tag,
  showCount,
  totalQuestions,
}) => {
  return (
    <Link className="flex justify-between gap-2" href={`/tags/${tag?._id}`}>
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        {tag?.name}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </Link>
  );
};

export default RenderTag;
