import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { getFormatNumber, getPluralString, getTimestamp } from "@/lib/utils";
import { PopulatedQuestionType } from "@/database/shared.types";

type QuestionCardProps = PopulatedQuestionType;

const QuestionCard: React.FC<QuestionCardProps> = (props) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 sm:hidden">
            {getTimestamp(props.createdAt)}
          </span>
          <Link href={`/question/${props._id}`}>
            <h3 className="base-semibold sm:h3-bold text-dark200_light900 line-clamp-1">
              {props.title}
            </h3>
          </Link>
        </div>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {props.tags?.map((item) => (
          <RenderTag
            key={item._id}
            _id={item._id}
            name={item.name}
            showCount={false}
          />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-6">
        <Metric
          imgUrl={props.author.picture}
          alt="avatar"
          value={props.author?.name}
          title={`- ${getTimestamp(props.createdAt)}`}
          href={`/profile/${props.author?.clerkId}`}
          className="body-medium text-dark400_light700"
          isAuthor={true}
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="upvotes"
          value={getFormatNumber(props.upvotes.length)}
          title={getPluralString(props.upvotes.length, "upvote")}
          className="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="messages"
          value={getFormatNumber(props.answers.length)}
          title={getPluralString(props.answers.length, "answer")}
          className="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={getFormatNumber(props.views)}
          title={getPluralString(props.views, "view")}
          className="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
