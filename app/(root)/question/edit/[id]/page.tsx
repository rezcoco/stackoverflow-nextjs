import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

const EditQuestion: React.FC<Props> = async ({ params }) => {
  const question = await getQuestionById({
    questionId: params.id,
  });

  if (!question) redirect("/");

  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const mongoUserId = await getUserById({ userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          type="edit"
          mongoUserId={mongoUserId?.id}
          question={JSON.parse(JSON.stringify(question))}
        />
      </div>
    </div>
  );
};

export default EditQuestion;
