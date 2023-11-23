import { getQuestionsByUserId } from "@/lib/actions/user.action";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

type Props = {
  userId: string;
  clerkId: string | null;
  page: number;
  pathname: string;
};

const QuestionTab: React.FC<Props> = async ({
  userId,
  clerkId,
  page,
  pathname,
}) => {
  const result = await getQuestionsByUserId({ userId, page });

  return (
    <>
      {result.questions.map((question) => (
        <QuestionCard key={question.id} clerkId={clerkId} question={question} />
      ))}
      {result.questions.length > 0 && (
        <div className="mt-10">
          <Pagination page={page} pathname={pathname} isNext={result.isNext} />
        </div>
      )}
    </>
  );
};

export default QuestionTab;
