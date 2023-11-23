"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";

type Props = {
  userId: string | null;
};

const LeftSidebar: React.FC<Props> = ({ userId }) => {
  const pathname = usePathname();

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          const NavContent = (
            <Link
              key={item.route}
              className={cn(
                "flex gap-4 items-center justify-start bg-transparent p-4 text-dark300_light900",
                { "text-light-900 primary-gradient rounded-lg": isActive }
              )}
              href={
                item.route === "/profile" ? `/profile/${userId}` : item.route
              }
            >
              <Image
                src={item.imgURL}
                height={20}
                width={20}
                alt={item.label}
                className={cn({ "invert-colors": !isActive })}
              />
              <p
                className={cn("base-medium max-lg:hidden", {
                  "base-bold": isActive,
                })}
              >
                {item.label}
              </p>
            </Link>
          );

          return item.route === "/profile" ? (
            <SignedIn key={item.label}>{NavContent}</SignedIn>
          ) : (
            NavContent
          );
        })}
      </div>
      <SignedOut>
        <div className="flex w-full flex-col gap-3">
          <Link href="/sign-in">
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/account.svg"
                width={20}
                height={20}
                alt="login"
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log in
              </span>
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/sign-up.svg"
                width={20}
                height={20}
                alt="sign up"
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden">Sign up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSidebar;
