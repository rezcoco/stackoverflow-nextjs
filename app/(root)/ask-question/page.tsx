import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask Question",
};

const AskQuestion = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const mongoUserId = await getUserById({ userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question type="post" mongoUserId={mongoUserId?.id} />
      </div>
    </div>
  );
};

export default AskQuestion;
