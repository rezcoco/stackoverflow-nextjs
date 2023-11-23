import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import React from "react";

const Community = async ({ searchParams }: SearchParamsProps) => {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const result = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/community"
          iconPosition="left"
          imgUrl="/assets/icons/search.svg"
          placeholder="Search for amazing minds"
          className="flex-1"
        />
        <Filter
          filters={UserFilters}
          className={"min-h-[56px] sm:min-w-[170px]"}
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No users yet</p>
            <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
              Join to be the first
            </Link>
          </div>
        )}
      </section>
      {result.users.length > 0 && (
        <div className="mt-10">
          <Pagination
            page={page}
            pathname="/community"
            isNext={result.isNext}
          />
        </div>
      )}
    </>
  );
};

export default Community;
