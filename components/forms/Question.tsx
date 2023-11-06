"use client";

import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionSchemaValidation } from "@/lib/validation";
import { Editor } from "@tinymce/tinymce-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { createQuestion } from "@/lib/actions/question.action";
import { useTheme } from "@/context/ThemeProvider";
import { useRouter, usePathname } from "next/navigation";

type FormSchemaType = z.infer<typeof QuestionSchemaValidation>;
const TYPE: "edit" | "post" = "post";

const Question: React.FC<{ mongoUserId: string }> = ({ mongoUserId }) => {
  const [isSubmiting, setIsSubmiting] = React.useState(false);
  const editorRef = React.useRef<null | any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(QuestionSchemaValidation),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  });

  async function onSubmit(values: FormSchemaType) {
    setIsSubmiting(true);

    console.log(pathname);

    try {
      await createQuestion({
        title: values.title,
        content: values.explanation,
        tags: values.tags,
        author: JSON.parse(mongoUserId),
        path: pathname,
      });

      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmiting(false);
    }
  }

  function handleTagRemove(
    e: React.MouseEvent<HTMLButtonElement>,
    tag: string,
    field: any
  ) {
    e.preventDefault();
    const newTags = field.value.filter((t: any) => t !== tag);

    form.setValue("tags", [...newTags]);
  }

  function handleInputKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) {
    if (
      e.key === "Enter" &&
      field.name === "tags" &&
      e.target instanceof HTMLInputElement
    ) {
      e.preventDefault();
      const value = e.target.value.trim().toLowerCase();

      if (value === "") return form.trigger();
      if (value.length > 15) {
        return form.setError("tags", {
          type: "required",
          message: "Tag must be less than 15 characters",
        });
      }
      if (!field.value.includes(value)) {
        form.setValue("tags", [...field.value, value]);
        e.target.value = "";
        form.clearErrors("tags");
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your probem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  key={theme}
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  onEditorChange={(e) => field.onChange(e)}
                  onBlur={field.onBlur}
                  initialValue=""
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
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce your problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="e.g. reactjs, javascript, typescript"
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                      {field.value.map((tag) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 uppercase"
                        >
                          {tag}
                          <button
                            onClick={(e) => handleTagRemove(e, tag, field)}
                          >
                            <Image
                              src="/assets/icons/close.svg"
                              width={12}
                              height={12}
                              alt="close"
                              className="cursor-pointer object-contain invert-0 dark:invert"
                            />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmiting}
          className={cn("primary-gradient w-fit !text-light-900")}
        >
          {isSubmiting
            ? TYPE === "post"
              ? "Posting..."
              : "Editing..."
            : TYPE === "post"
            ? "Ask a Question"
            : "Edit Question"}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
