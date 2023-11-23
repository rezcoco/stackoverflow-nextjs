import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import { savedQustions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId: clerkId } = auth();
  const page = searchParams.page ? Number(searchParams.page) : 1;
  if (!clerkId) redirect("/");
  const result = await savedQustions({
    clerkId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgUrl="/assets/icons/search.svg"
          placeholder="Search questions..."
          className="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          className={"min-h-[56px] sm:min-w-[170px]"}
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.saved.length > 0 ? (
          result.saved.map((question) => (
            <QuestionCard
              key={question._id}
              clerkId={clerkId}
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
      {result.saved.length > 0 && (
        <div className="mt-10">
          <Pagination
            page={page}
            pathname="/collection"
            isNext={result.isNext}
          />
        </div>
      )}
    </>
  );
}
