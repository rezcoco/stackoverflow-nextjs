import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

type FilterProps = {
  filters: {
    name: string;
    value: string;
  }[];
  className?: string;
  containerClasses?: string;
};

const Filter: React.FC<FilterProps> = (props) => {
  return (
    <div className={cn("relative", props.containerClasses)}>
      <Select>
        <SelectTrigger
          className={cn(
            "body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5",
            props.className
          )}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {props.filters.map((item) => (
              <SelectItem key={item.name} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
