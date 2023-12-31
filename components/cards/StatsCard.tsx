import Image from "next/image";
import React from "react";

type Props = {
  imgUrl: string;
  value: number;
  title: string;
};

const StatsCard: React.FC<Props> = ({ imgUrl, value, title }) => {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
      <Image src={imgUrl} width={40} height={40} alt="Badge" />
      <div>
        <p className="paragraph-semibold text-dark200_light900">{value}</p>
        <p className="body-medium text-dark400_light700">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
