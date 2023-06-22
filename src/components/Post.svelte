<script lang="ts">
  import type { Post } from "../lib/db";
  import dayjs from "dayjs";
  import { Trash2Icon } from "svelte-feather-icons";
  import { enhance } from "$app/forms";

  export let post: Post;

  $: formattedDate = dayjs(post.createdAt).format("MMMM D h:mm a");
</script>

<li class="group relative post py-8 border-sun-100 grid gap-6">
  <header class="relative">
    <p class="text-sun-700 text-sm font-mono">{formattedDate}</p>

    <form class="absolute right-4 top-0" method="POST" action="?/deletePost" use:enhance>
      <input type="hidden" name="id" value={post.id} />
      <button
        class="text-pink-400 opacity-0 group-hover:opacity-100 hover:text-pink-500 transition-opacity"
      >
        <Trash2Icon class="text-current" size="18" />
      </button>
    </form>
  </header>

  {#if post.images.length > 0}
    <div class="grid grid-cols-1 {post.images.length >= 2 ? 'sm:grid-cols-2' : ''}  gap-2">
      {#each post.images as image}
        <img src={`/image/${image}`} alt="" class="max-w-max max-h-[500px] w-full rounded-sm" />
      {/each}
    </div>
  {/if}

  {#if post.text}
    <p class="font-mono whitespace-pre">{post.text}</p>
  {/if}
</li>
