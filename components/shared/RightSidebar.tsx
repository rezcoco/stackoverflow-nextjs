import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";

const RightSidebar = () => {
  const hotQuestions = [
    { _id: 1, title: "Why my css behave different compared to the tutorial?" },
    { _id: 2, title: "Does css really that hard?" },
    { _id: 3, title: "How to master a new technology faster" },
    { _id: 4, title: "What should i do after i finished this course?" },
  ];

  const popularTags = [
    { _id: 1, name: "javascript", totalQuestions: 10 },
    { _id: 2, name: "next", totalQuestions: 16 },
    { _id: 3, name: "react", totalQuestions: 14 },
    { _id: 4, name: "node", totalQuestions: 12 },
  ];

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px]">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              key={question._id}
              href={`/question/${question._id}`}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src="/assets/icons/chevron-right.svg"
                width={20}
                height={20}
                alt="chevron right"
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <RenderTag key={tag._id} {...tag} showCount />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
