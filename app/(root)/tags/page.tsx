import TagCard from "@/components/cards/TagCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import React from "react";

const Tags = async ({ searchParams }: SearchParamsProps) => {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const result = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/tags"
          iconPosition="left"
          imgUrl="/assets/icons/search.svg"
          placeholder="Search by tag name..."
          className="flex-1"
        />
        <Filter
          filters={TagFilters}
          className={"min-h-[56px] sm:min-w-[170px]"}
        />
      </div>
      <section className="mt-12 flex w-full flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => {
            return (
              <Link
                key={tag._id}
                href={`/tags/${tag._id}`}
                className="shadow-light100_darknone"
              >
                <TagCard key={tag._id} tag={tag} />
              </Link>
            );
          })
        ) : (
          <NoResult
            title="No Tags Found"
            description="It looks like there are no tags found"
            link="/ask-question"
            linkLabel="Ask a Question"
          />
        )}
      </section>
      {result.tags.length > 0 && (
        <div className="mt-10">
          <Pagination page={page} pathname="/tags" isNext={result.isNext} />
        </div>
      )}
    </>
  );
};

export default Tags;
