"use client";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NavContent = () => {
  const pathname = usePathname();

  return (
    <section className="flex h-full w-full flex-col gap-2 pt-16 sm:gap-6">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        const NavContent = (
          <SheetClose key={item.label} asChild>
            <Link
              className={cn(
                "flex gap-4 items-center justify-start bg-transparent p-4 text-dark300_light900",
                { "text-light-900 primary-gradient rounded-lg": isActive }
              )}
              href={item.route}
            >
              <Image
                src={item.imgURL}
                height={20}
                width={20}
                alt={item.label}
                className={cn({ "invert-colors": !isActive })}
              />
              <p className={cn("base-medium", { "base-bold": isActive })}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );

        return item.route === "/profile" ? (
          <SignedIn>{NavContent}</SignedIn>
        ) : (
          NavContent
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          width={36}
          height={36}
          alt="menu"
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 border-none"
      >
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/images/site-logo.svg"
            width={23}
            height={23}
            alt="DevFlow"
          />
          <p className="h2-bold text-dark100_light900 font-spaceGrotesk">
            Dev<span className="text-primary-500">Overflow</span>
          </p>
        </Link>
        <div className="flex h-[calc(100vh-80px)] flex-col gap-3">
          <SheetClose asChild>
            <NavContent />
          </SheetClose>

          <SignedOut>
            <div className="flex w-full flex-col gap-3">
              <SheetClose asChild>
                <Link href="/sign-in">
                  <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    <span className="primary-text-gradient">Log in</span>
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/sign-up">
                  <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    Sign up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
