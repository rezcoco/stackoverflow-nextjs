import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { getFormatNumber, getPluralString, getTimestamp } from "@/lib/utils";
import { Populated } from "@/database/shared.types";
import EditDeleteActions from "../shared/EditDeleteActions";
import { SignedIn } from "@clerk/nextjs";
import { TQuestionDoc } from "@/database/question.model";

type QuestionCardProps = {
  question: Populated<TQuestionDoc, "author" | "tags">;
  clerkId: string | null;
};

const QuestionCard: React.FC<QuestionCardProps> = async ({
  question,
  clerkId,
}) => {
  const isAuthor = clerkId && clerkId === question.author.clerkId;
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 sm:hidden">
            {getTimestamp(question.createdAt)}
          </span>
          <Link href={`/question/${question._id}`}>
            <h3 className="base-semibold sm:h3-bold text-dark200_light900 line-clamp-1">
              {question.title}
            </h3>
          </Link>
        </div>
        {isAuthor && (
          <SignedIn>
            <EditDeleteActions type="question" itemId={question.id} />
          </SignedIn>
        )}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {question.tags?.map((tag) => <RenderTag key={tag?._id} tag={tag} />)}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={question.author.picture}
          alt="avatar"
          value={question.author.name}
          title={`- ${getTimestamp(question.createdAt)}`}
          href={`/profile/${question.author?.clerkId}`}
          className="body-medium text-dark400_light700"
          isAuthor={isAuthor || false}
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="upvotes"
            value={getFormatNumber(question.upvotes.length)}
            title={getPluralString(question.upvotes.length, "upvote")}
            className="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="messages"
            value={getFormatNumber(question.answers.length)}
            title={getPluralString(question.answers.length, "answer")}
            className="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={getFormatNumber(question.views)}
            title={getPluralString(question.views, "view")}
            className="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
