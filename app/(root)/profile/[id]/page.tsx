import ProfileDetail from "@/components/shared/ProfileDetail";
import Stats from "@/components/shared/Stats";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/actions/user.action";
import { getTimestamp } from "@/lib/utils";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswerTab from "@/components/shared/AnswerTab";
import { SearchParamsProps } from "@/types";

type Props = SearchParamsProps & {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const userInfo = await getUserInfo({ userId: params.id });

  return {
    title:
      `${userInfo.user.name} (@${userInfo.user.username}) | DevOverflow` ||
      "Profile",
  };
}

const Profile: React.FC<Props> = async ({ params, searchParams }) => {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const { userId: clerkId } = auth();
  const userInfo = await getUserInfo({ userId: params.id });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            className="rounded-full object-cover"
            src={userInfo.user.picture}
            width={140}
            height={140}
            alt={userInfo.user.name}
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo.user.username}
            </p>
            <div className="mt-5 flex-wrap items-center justify-start gap-5">
              {userInfo.user.location && (
                <ProfileDetail
                  imgUrl="/assets/icons/location.svg"
                  href={userInfo.user.location}
                  title="Location"
                />
              )}
              {userInfo.user.portfolioWebsite && (
                <ProfileDetail
                  imgUrl="/assets/icons/link.svg"
                  href={userInfo.user.portfolioWebsite}
                  title="Portfolio"
                />
              )}
              <ProfileDetail
                imgUrl="/assets/icons/calendar.svg"
                title={`Joined ${getTimestamp(userInfo.user.joinedAt)}`}
              />
            </div>
            {userInfo.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {userInfo.user.bio}
              </p>
            )}
          </div>
        </div>
        {clerkId === params.id && (
          <SignedIn>
            <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </SignedIn>
        )}
      </div>
      <Stats
        totalAnswers={userInfo.totalAnswers}
        totalQuestions={userInfo.totalQuestions}
        badges={userInfo.badges}
        reputation={userInfo.reputaion || 0}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answer" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <QuestionTab
              page={page}
              pathname={`/profile/${params.id}`}
              userId={userInfo.user.id}
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent
            value="answer"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <AnswerTab
              page={page}
              pathname={`/profile/${params.id}`}
              clerkId={clerkId}
              userId={userInfo.user.id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
