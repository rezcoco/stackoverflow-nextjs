import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  imgUrl: string;
  title: string;
  href?: string;
};

const ProfileDetail: React.FC<Props> = ({ imgUrl, href, title }) => {
  return (
    <div className="flex-center gap-1">
      <Image src={imgUrl} width={20} height={20} alt={title} />
      {href ? (
        <Link className="paragraph-medium text-blue-500" href={href}>
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileDetail;
