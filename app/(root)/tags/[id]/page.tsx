import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getQuestionByTagId } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type Props = SearchParamsProps & {
  params: {
    id: string;
  };
};

const TagsDetail: React.FC<Props> = async ({ params, searchParams }) => {
  const { userId } = auth();
  if (!userId) redirect("/");
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const result = await getQuestionByTagId({
    tagId: params.id,
    searchQuery: searchParams.q,
    page,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result?.tagName}</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={`tags/${params.id}`}
          iconPosition="left"
          imgUrl="/assets/icons/search.svg"
          placeholder="Search questions..."
          className="flex-1"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              clerkId={userId}
              question={question}
            />
          ))
        ) : (
          <NoResult
            link="/ask-question"
            linkLabel="Ask a question"
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
          />
        )}
      </div>
      {result.questions.length > 0 && (
        <div className="mt-10">
          <Pagination
            page={page}
            pathname={`/tags/${params.id}`}
            isNext={result.isNext}
          />
        </div>
      )}
    </>
  );
};

export default TagsDetail;
