import { UserType } from "@/database/shared.types";
import { getTopInteractedTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import { Badge } from "../ui/badge";

type UserCardProps = {
  user: Partial<UserType>;
};

const UserCard: React.FC<UserCardProps> = async ({ user }) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });

  return (
    <div className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-xl border p-8">
        <Image
          src={user.picture!}
          width={100}
          height={100}
          alt="user profile picture"
          className="rounded-full"
        />
        <Link href={`/profile/${user.clerkId}`} className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </Link>
        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </div>
  );
};

export default UserCard;
