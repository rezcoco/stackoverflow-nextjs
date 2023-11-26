"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { getFormatNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "../ui/use-toast";

type VotesWithSave = {
  hasSaved: boolean;
  type: "question";
};

type VotesWithoutSave = {
  type: "answer";
};

type Props = {
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
} & (VotesWithSave | VotesWithoutSave);

const Votes: React.FC<Props> = (props) => {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    viewQuestion({
      userId: props.userId,
      questionId: props.itemId,
    });
  }, [props.userId, props.itemId, pathname, router]);

  async function handelVote(action: "upvote" | "downvote") {
    if (!props.userId) {
      return toast({
        title: "Please log in",
        description: "You must logged in to perform this action",
      });
    }

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

      return toast({
        title: `${props.hasUpvoted ? "Upvote removed" : "Upvote Successful"}`,
      });
    } else if (action === "downvote") {
      if (props.type === "question") {
        await downvoteQuestion(
          Object.assign(params, { questionId: props.itemId })
        );
      } else if (props.type === "answer") {
        await downvoteAnswer(Object.assign(params, { answerId: props.itemId }));
      }

      return toast({
        title: `${
          props.downvotes ? "Downvote removed" : "Downvote Successful"
        }`,
      });
    }
  }

  async function handleSave() {
    if (!props.userId) {
      return toast({
        title: "Please log in",
        description: "You must logged in to perform this action",
      });
    }

    await toggleSaveQuestion({
      userId: props.userId,
      questionId: props.itemId,
      hasSaved: "hasSaved" in props && props.hasSaved,
      path: pathname,
    });

    return toast({
      title: `${
        "hasSaved" in props && props.hasSaved
          ? "Question removed from your collection"
          : "Question saved"
      }`,
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
