import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { createPost } from "~/models/post.server";
import invariant from "tiny-invariant";
import AdminIndex from "~/routes/posts/admin/index";

type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
      error?: never;
    }
  | {
      title?: never;
      slug?: never;
      markdown?: never;
      error: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({ request }) => {
  // TODO: remove me
  await new Promise((res) => setTimeout(res, 3000));

  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: ActionData = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  try {
    throw new Error("TODO: Remove - some error");
    await createPost({ title, slug, markdown });

    return redirect("/posts/admin");
  } catch (err) {
    return json<ActionData>(
      { error: "Sorry, we couldn't create the post" },
      { status: 500 }
    );
  }
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function NewPost() {
  const errors = useActionData<ActionData>();

  const transition = useTransition();
  const isCreating = Boolean(transition.submission);

  return isCreating ? (
    <AdminIndex isOptimistic={true} />
  ) : (
    <>
      <Form method="post">
        <p>
          <label>
            Post Title:{" "}
            {errors?.title ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
            <input type="text" name="title" className={inputClassName} />
          </label>
        </p>
        <p>
          <label>
            Post Slug:{" "}
            {errors?.slug ? (
              <em className="text-red-600">{errors.slug}</em>
            ) : null}
            <input type="text" name="slug" className={inputClassName} />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">
            Markdown:{" "}
            {errors?.markdown ? (
              <em className="text-red-600">{errors.markdown}</em>
            ) : null}
          </label>
          <br />
          <textarea
            id="markdown"
            rows={20}
            name="markdown"
            className={`${inputClassName} font-mono`}
          />
        </p>
        <p className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Post"}
          </button>
        </p>
      </Form>
      {errors?.error ? (
        <p className="text-red-600">
          <strong>{errors.error}</strong>
        </p>
      ) : null}
    </>
  );
}
