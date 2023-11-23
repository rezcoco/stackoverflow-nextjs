import { getAnswersByUserId } from "@/lib/actions/user.action";
import React from "react";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

type Props = {
  userId: string;
  clerkId: string | null;
  page: number;
  pathname: string;
};

const AnswerTab: React.FC<Props> = async ({
  userId,
  clerkId,
  page,
  pathname,
}) => {
  const result = await getAnswersByUserId({ userId, page });

  return (
    <>
      {result.answers.map((answer) => (
        <AnswerCard key={answer.id} clerkId={clerkId} answer={answer} />
      ))}
      {result.answers.length > 0 && (
        <div className="mt-10">
          <Pagination page={page} pathname={pathname} isNext={result.isNext} />
        </div>
      )}
    </>
  );
};

export default AnswerTab;
