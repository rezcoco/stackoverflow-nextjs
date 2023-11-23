import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const EditProfile = async () => {
  const { userId } = auth();
  if (!userId) redirect("/");

  const user = await getUserById({ userId });
  if (!user) redirect("/");

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <Profile user={JSON.parse(JSON.stringify(user))} />
    </>
  );
};

export default EditProfile;
