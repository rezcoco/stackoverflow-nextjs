"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { AnswerSchemaType, AnswerSchemaValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { toast } from "../ui/use-toast";

type Props = {
  userId: string;
  questionId: string;
  question: string;
};

const Answer: React.FC<Props> = ({ userId, questionId, question }) => {
  const editorRef = React.useRef<null | any>(null);
  const { theme } = useTheme();
  const pathname = usePathname();
  const [isSubmiting, setIsSubmiting] = React.useState(false);
  const [isGenAiSubmiting, setIsGenAiSubmiting] = React.useState(false);
  const form = useForm<AnswerSchemaType>({
    resolver: zodResolver(AnswerSchemaValidation),
    defaultValues: {
      answer: "",
    },
  });

  async function handleCreateAnswer(values: AnswerSchemaType) {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You must logged in to perform this action",
      });
    }

    setIsSubmiting(true);

    try {
      await createAnswer({
        content: values.answer,
        author: userId,
        question: questionId,
        path: pathname,
      });

      form.reset();
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmiting(false);
    }
  }

  async function handleAiGeneratedAnswer() {
    if (!userId) {
      return toast({
        title: "Please log in",
        description: "You must logged in to perform this action",
      });
    }
    setIsGenAiSubmiting(true);

    try {
      const res = await fetch(`/api/chatgpt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const aiAnswer = await res.json();

      const formatedAiAnswer =
        typeof aiAnswer?.data === "string"
          ? aiAnswer.data.replace(/\n/g, "<br />")
          : "";

      console.log(formatedAiAnswer);

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formatedAiAnswer);
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsGenAiSubmiting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          disabled={isGenAiSubmiting}
          onClick={() => handleAiGeneratedAnswer()}
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none"
        >
          <Image
            src="/assets/icons/stars.svg"
            alt="star"
            width={12}
            height={12}
            className=""
          />
          <p>{isGenAiSubmiting ? "Generating..." : "Generate an AI answer"}</p>
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    key={theme}
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    onEditorChange={(e) => field.onChange(e)}
                    onBlur={field.onBlur}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic forecolor | alignleft aligncenter |" +
                        "alignright alignjustify | bullist numlist",
                      content_style:
                        "body { font-family: Inter; font-size: 16px }",
                      skin: theme === "dark" ? "oxide-dark" : undefined,
                      content_css: theme === "dark" ? "dark" : undefined,
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              className="primary-gradient w-fit text-white"
              type="submit"
              disabled={isSubmiting}
            >
              {isSubmiting ? "Submiting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
