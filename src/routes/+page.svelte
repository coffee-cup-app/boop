<script lang="ts">
  import Input from "../components/Input.svelte";
  import Logo from "../components/Logo.svelte";
  import Post from "../components/Post.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: posts = Array.from(data.posts);
</script>

<svelte:head>
  <title>Railway feed</title>
  <meta name="description" content="Railway persistent volumes demo app" />
</svelte:head>

<section>
  <header class="flex items-center justify-center gap-8">
    <Logo size={60} />
    <div class="grid gap-2">
      <h1 class="text-4xl font-semibold text-center">railway feed</h1>
      <p class="text-base font-medium text-center">a place to test persistent volumes</p>
    </div>
  </header>

  <div class="flex flex-col-reverse md:flex-row gap-4 md:gap-8 my-12">
    {#if data.variables.ORIGIN == null && data.variables.NODE_ENV === "production"}
      <div class="p-4 font-mono flex-grow bg-sun-100 border border-sun-300 rounded-sm">
        You need to set the <span class="text-sun-600">ORIGIN</span> environment variable to use this
        app in production.
      </div>
    {:else}
      <Input />
    {/if}

    <div class="flex flex-row md:flex-col gap-8 md:gap-2 text-sun-500 text-sm font-mono">
      <p><span class="text-sun-400">mount:</span> {data.variables.RAILWAY_VOLUME_MOUNT_PATH}</p>
      <p><span class="text-sun-400">size:</span> {data.dataDirSizeMB} MB</p>
      <p><span class="text-sun-400">volume:</span> {data.variables.RAILWAY_VOLUME_NAME}</p>

      {#if data.variables.RAILWAY_SERVICE_NAME}
        <p><span class="text-sun-400">service:</span> {data.variables.RAILWAY_SERVICE_NAME}</p>
      {/if}
    </div>
  </div>

  <ul class="grid divide-y">
    {#each posts as p (p.id)}
      <Post post={p} />
    {/each}
  </ul>
</section>
