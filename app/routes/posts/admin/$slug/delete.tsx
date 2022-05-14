import { Form, useLoaderData, useTransition } from "@remix-run/react";
import type { Post } from "~/models/post.server";
import { deletePost, getPost } from "~/models/post.server";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

type LoaderData = { post: Post };

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  return json<LoaderData>({ post });
};

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.slug, `params.slug is required`);

  const formData = await request.formData();
  const slug = formData.get("slug");

  invariant(typeof slug === "string", "slug must be a string");
  invariant(slug === params.slug, "slug must match params.slug");

  await deletePost({ slug });
  return redirect("/posts/admin");
};

export default function UpdatePost() {
  const { post } = useLoaderData<LoaderData>();

  const transition = useTransition();
  const isDeleting = Boolean(transition.submission);

  return (
    <Form method="post">
      <p>
        Delete post titled "{post.title}" with slug "{post.slug}"?
      </p>
      <input type="text" name="slug" hidden={true} value={post.slug} readOnly />
      <button
        type="submit"
        className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete Post"}
      </button>
    </Form>
  );
}
