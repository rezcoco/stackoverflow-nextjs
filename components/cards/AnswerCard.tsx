import { getFormatNumber, getPluralString, getTimestamp } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Metric from "../shared/Metric";
import EditDeleteActions from "../shared/EditDeleteActions";
import { SignedIn } from "@clerk/nextjs";
import { Populated } from "@/database/shared.types";
import { TAnswerDoc } from "@/database/answer.model";

type Props = {
  answer: Populated<TAnswerDoc, "author" | "question">;
  clerkId: string | null;
};

const AnswerCard: React.FC<Props> = async ({ answer, clerkId }) => {
  const isAuthor = clerkId && clerkId === answer.author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(answer.createdAt)}
          </span>
          <Link
            href={`/question/${answer.question.id}#${answer.id}`}
            className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1"
          >
            {answer.question.title}
          </Link>
        </div>
        {isAuthor && (
          <SignedIn>
            <EditDeleteActions itemId={answer.id} type="answer" />
          </SignedIn>
        )}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={answer.author.picture}
          value={answer.author.name}
          title={`- answered ${getTimestamp(answer.createdAt)}`}
          href={answer.author.clerkId}
          className="body-medium text-dark400_light700"
          alt="avatar"
          isAuthor={isAuthor || false}
        />
        <div className="flex-center gap-3">
          <div className="flex-center flex-wrap gap-1">
            <Metric
              imgUrl="/assets/icons/like.svg"
              alt="upvotes"
              value={getFormatNumber(answer.upvotes.length)}
              title={getPluralString(answer.upvotes.length, "upvote")}
              className="small-medium text-dark400_light800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
