import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { getFormatNumber, getPluralString, getTimestamp } from "@/lib/utils";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = SearchParamsProps & {
  params: {
    id: string;
  };
};

const QuestionDetail: React.FC<Props> = async ({ params, searchParams }) => {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const result = await getQuestionById({ questionId: params.id });
  const { userId } = auth();

  if (!userId) redirect("/sign-in");
  if (!result) redirect("/");

  const mongoUser = await getUserById({ userId });
  if (!mongoUser) redirect("/");

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result?.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result!.author.picture}
              width={22}
              height={22}
              alt="profile"
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result?.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              upvotes={result.upvotes.length}
              downvotes={result.downvotes.length}
              hasUpvoted={result.upvotes.includes(mongoUser?.id)}
              hasDownvoted={result.downvotes.includes(mongoUser?.id)}
              hasSaved={mongoUser.saved.includes(result.id)}
              itemId={result.id}
              userId={mongoUser.id}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result?.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          title={`${getTimestamp(result!.createdAt)}`}
          value="asked"
          href={`/profile/${result?.author?.clerkId}`}
          className="body-medium text-dark400_light700"
          isAuthor={true}
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="messages"
          value={getFormatNumber(result!.answers.length)}
          title={getPluralString(result!.answers.length, "answer")}
          className="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={getFormatNumber(result!.views)}
          title={getPluralString(result!.views, "view")}
          className="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={result!.content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {result?.tags.map((tag) => (
          <RenderTag
            key={tag?.id}
            tag={tag}
            totalQuestions={tag.questions.length}
          />
        ))}
      </div>
      <AllAnswers
        questionId={result?.id}
        userId={mongoUser?.id}
        totalAnswers={result.answers.length}
        page={page}
        filter={searchParams.filter}
      />
      {/* Form */}
      <Answer
        userId={mongoUser?.id}
        questionId={result?.id}
        question={result!.content}
      />
    </>
  );
};

export default QuestionDetail;
