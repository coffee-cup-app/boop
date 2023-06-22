import { fail } from "@sveltejs/kit";
import { createPost, dataDirectory, deletePost, env, getPosts, saveImage } from "../lib/db";
import { getDirectorySizeBytes } from "../lib/dirs";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async () => {
  const posts = await getPosts();
  const variables = env;
  const dataDirSizeBytes = getDirectorySizeBytes(dataDirectory);
  const dataDirSizeMB = Math.round(dataDirSizeBytes / 1024 / 1024);

  return {
    posts,
    variables,
    dataDirSizeMB
  };
}) satisfies PageServerLoad;

export const actions = {
  createPost: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());

    const text = data.text as string;
    const imageFiles = Object.entries(data)
      .filter(([key]) => key.startsWith("imageUpload"))
      .map(([, value]) => value as File)
      .filter((file) => file.size > 0);

    console.log("\n=== Create post request", { text, imageFiles });

    const images = await Promise.all(imageFiles.map((file) => saveImage(file)));

    await createPost(text, images);
  },

  deletePost: async ({ request }) => {
    const data = await request.formData();
    await deletePost(data.get("id") as string);
  }
} satisfies Actions;
