"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { getFormatNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  type: "question" | "answer";
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  hasSaved?: boolean;
};

const Votes: React.FC<Props> = (props) => {
  const pathname = usePathname();

  async function handelVote(action: "upvote" | "downvote") {
    if (!props.userId) return;

    const params = {
      userId: props.userId,
      hasupVoted: props.hasUpvoted,
      hasdownVoted: props.hasDownvoted,
      path: pathname,
    };

    if (action === "upvote") {
      if (props.type === "question") {
        await upvoteQuestion(
          Object.assign(params, { questionId: props.itemId })
        );
      } else if (props.type === "answer") {
        await upvoteAnswer(Object.assign(params, { answerId: props.itemId }));
      }
    } else if (action === "downvote") {
      if (props.type === "question") {
        await downvoteQuestion(
          Object.assign(params, { questionId: props.itemId })
        );
      } else if (props.type === "answer") {
        await downvoteAnswer(Object.assign(params, { answerId: props.itemId }));
      }
    }
  }

  async function handleSave() {
    await toggleSaveQuestion({
      userId: props.userId,
      questionId: props.itemId,
      hasSaved: props.hasSaved!,
      path: pathname,
    });
  }

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={`/assets/icons/${props.hasUpvoted ? "upvoted" : "upvote"}.svg`}
            width={18}
            height={18}
            alt="upvote"
            onClick={() => handelVote("upvote")}
            role="button"
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {getFormatNumber(props.upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={`/assets/icons/${
              props.hasDownvoted ? "downvoted" : "downvote"
            }.svg`}
            width={18}
            height={18}
            alt="downvote"
            onClick={() => handelVote("downvote")}
            role="button"
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {getFormatNumber(props.downvotes)}
            </p>
          </div>
        </div>
      </div>
      {props.type === "question" && (
        <Image
          src={`/assets/icons/${
            props.hasSaved ? "star-filled" : "star-red"
          }.svg`}
          width={18}
          height={18}
          alt="save"
          role="button"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
