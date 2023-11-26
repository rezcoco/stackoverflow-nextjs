"use client";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "../ui/use-toast";

type Props = {
  type: "question" | "answer";
  itemId: string;
};

const EditDeleteActions: React.FC<Props> = ({ type, itemId }) => {
  const pathname = usePathname();
  const router = useRouter();

  function handleEdit() {
    router.push(`/question/edit/${itemId}`);
  }

  async function handleDelete() {
    if (type === "question") {
      await deleteQuestion({ questionId: itemId, path: pathname });
    } else if (type === "answer") {
      await deleteAnswer({ answerId: itemId, path: pathname });
    }

    return toast({
      title: `${type} deleted`,
    });
  }
  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "question" && (
        <Image
          role="button"
          src="/assets/icons/edit.svg"
          width={14}
          height={14}
          alt="edit"
          onClick={handleEdit}
        />
      )}
      <Image
        role="button"
        src="/assets/icons/trash.svg"
        width={14}
        height={14}
        alt="trash"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteActions;
