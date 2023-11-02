import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const questions = [
  {
    _id: 1,
    title: "How to create a responsive website?",
    tags: [
      { _id: 101, name: "HTML" },
      { _id: 102, name: "CSS" },
    ],
    author: {
      _id: 201,
      name: "John Doe",
      picture: "john-doe.jpg",
    },
    views: 500,
    answers: [
      { answerId: 1, content: "Use media queries in CSS for responsiveness." },
      { answerId: 2, content: "Consider using a responsive CSS framework." },
    ],
    createdAt: "2023-10-04T14:32:45.678Z",
    upvotes: 15,
  },
  {
    _id: 2,
    title: "What is JavaScript closure?",
    tags: [{ _id: 103, name: "JavaScript" }],
    author: {
      _id: 202,
      name: "Alice Smith",
      picture: "alice-smith.jpg",
    },
    views: 7500,
    answers: [
      {
        answerId: 3,
        content:
          "A closure is a function with access to its own scope and the outer (enclosing) function's scope.",
      },
    ],
    createdAt: "2023-11-01T15:07:07.344Z",
    upvotes: 20,
  },
  {
    _id: 3,
    title: "Best practices for database design?",
    tags: [
      { _id: 104, name: "Database" },
      { _id: 105, name: "SQL" },
    ],
    author: {
      _id: 203,
      name: "Eleanor Brown",
      picture: "eleanor-brown.jpg",
    },
    views: 600,
    answers: [],
    createdAt: "2023-10-07T19:05:10.987Z",
    upvotes: 10,
  },
];

export default function Home() {
  return (
    <>
      <div className="h1-bold text-dark100_light900 flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1>All questions</h1>
        <Link className="flex justify-end max-sm:w-full" href="/ask-question">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgUrl="/assets/icons/search.svg"
          placeholder="Search questions..."
          className="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          className={"min-h-[56px] sm:min-w-[170px]"}
          containerClasses={"hidden max-md:flex"}
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question._id} {...question} />
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
    </>
  );
}
