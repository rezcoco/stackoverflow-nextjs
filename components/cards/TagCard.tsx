import { TagType } from "@/database/shared.types";
import { getPluralString } from "@/lib/utils";
import React from "react";

type TagCardProps = {
  tag: Partial<TagType>;
};

const TagCard: React.FC<TagCardProps> = ({ tag }) => {
  return (
    <article className="background-light900_dark200 light-border flex w-full flex-col justify-center rounded-2xl border px-8 py-10 sm:w-[260px]">
      <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
        <p className="paragraph-semibold text-dark300_light900">{tag.name}</p>
      </div>
      <p className="small-regular text-dark500_light700 mt-4">
        {tag.description}
      </p>
      <p className="small-regular text-dark400_light500 mt-3.5">
        <span className="body-semibold primary-text-gradient mr-2.5">
          {tag.questions?.length}+
        </span>
        {getPluralString(tag.questions!.length, "Question")}
      </p>
    </article>
  );
};

export default TagCard;
