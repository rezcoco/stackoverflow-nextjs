import React from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";

type Props = {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: number;
};

const AllAnswers: React.FC<Props> = async ({
  questionId,
  userId,
  totalAnswers,
}) => {
  const answers = await getAnswers({ questionId });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div>
        {answers.map((answer) => (
          <article key={answer.id} className="light-border border-b py-10">
            <div className="flex items-center justify-between ">
              <div className="mb-8 flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt="profile"
                    className="rounded-full"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}
                    </p>
                    <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1">
                      <span className="mx-1 max-sm:hidden">-</span>
                      answered {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <Votes
                    type="answer"
                    itemId={answer.id}
                    userId={answer.author.id}
                    upvotes={answer.upvotes.length}
                    downvotes={answer.downvotes.length}
                    hasUpvoted={answer.upvotes.includes(answer.author.id)}
                    hasDownvoted={answer.downvotes.includes(answer.author.id)}
                  />
                </div>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
