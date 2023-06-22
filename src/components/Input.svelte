<script lang="ts">
  import { XIcon } from "svelte-feather-icons";
  import { invalidateAll } from "$app/navigation";
  import { enhance } from "$app/forms";

  let text = "";
  let form: HTMLFormElement;
  let textarea: HTMLTextAreaElement;
  let fileInput: HTMLInputElement;

  let creating = false;
  let dragging = false;

  let error = "";

  let inputFiles: File[] = [];

  const authorizedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

  const getFilesFromDropEvent = ({ dataTransfer }: DragEvent) => {
    if (dataTransfer == null) return;

    const { files, items } = dataTransfer;

    return files.length
      ? Array.from(files)
      : Array.from(items)
          .filter(({ kind }: DataTransferItem) => kind === "file")
          .map((item: DataTransferItem) => item.getAsFile() as File);
  };

  const getFilesFromInputEvent = ({ target }: { target: HTMLInputElement }) => {
    const files = target.files ? [...target.files] : [];
    target.value = "";
    return files;
  };

  let debounce: NodeJS.Timeout;
  const startDragging = () => {
    clearTimeout(debounce);
    dragging = true;
  };

  const stopDragging = () => {
    debounce = setTimeout(() => {
      dragging = false;
    }, 500);
  };

  const onFile = (getFilesFunction: any) => (event: any) => {
    dragging = false;
    const files = getFilesFunction(event);
    inputFiles = files;
  };

  let errorTimeout: NodeJS.Timeout;

  const onSubmit = async () => {
    const formData = new FormData(form);

    if (text == "" && inputFiles.length == 0) return;

    if (inputFiles.length) {
      inputFiles.forEach((file, i) => {
        formData.append(`imageUpload-${i}`, file);
      });
    }

    try {
      clearTimeout(errorTimeout);
      error = "";

      const res = await fetch("/?/createPost", {
        method: "POST",
        body: formData
      });
      if (res.status !== 200) {
        throw new Error(await res.text());
      }

      inputFiles = [];
      text = "";
    } catch (e) {
      error = "Failed to create post";
      errorTimeout = setTimeout(() => {
        error = "";
      }, 4000);
    }

    invalidateAll();
    setTimeout(() => textarea.focus(), 0);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    // If cmd+enter or ctrl+enter is pressed, submit the form
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      form.dispatchEvent(new Event("submit"));
    }
  };
</script>

<form
  bind:this={form}
  method="POST"
  on:drop|preventDefault={onFile(getFilesFromDropEvent)}
  on:dragover|preventDefault={startDragging}
  on:dragleave|preventDefault={stopDragging}
  on:submit|preventDefault={async () => {
    if (creating) return;
    creating = true;

    await onSubmit();

    creating = false;
  }}
  on:keydown={onKeyDown}
  class="relative flex-grow grid gap-4 items-end"
>
  {#if error}
    <p class="bg-red-100 text-red-800 px-4 py-2 rounded border border-red-300">{error}</p>
  {/if}

  {#if dragging}
    <div
      class="absolute inset-0 flex items-center justify-center bg-sun-50 bg-opacity-95 border-dotted border-2 border-sun-500 rounded overflow-hidden"
    >
      <p class="text-sun-500 text-2xl font-semibold">Drop files to upload</p>
    </div>
  {/if}

  <textarea
    bind:this={textarea}
    name="text"
    required={false}
    maxlength="120"
    bind:value={text}
    placeholder="Post some text, an image, or both!"
    class="px-4 py-4 font-mono border border-sun-200 rounded-sm w-full text-blue-950 resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
  />

  <div class="flex items-center justify-between gap-4">
    {#if inputFiles.length > 0}
      <div class="flex gap-2 items-center">
        <button
          type="button"
          class="text-sm text-blue-900 hover:text-blue-950"
          on:click={() => {
            inputFiles = [];
          }}
        >
          <XIcon size="16" />
        </button>

        {#if inputFiles.length === 1}
          <p class="text-blue-900 text-sm">{inputFiles[0].name}</p>
        {:else if inputFiles.length > 1}
          <p class="text-blue-900 text-sm">{inputFiles.length} files</p>
        {/if}
      </div>
    {:else}
      <label>
        <input
          bind:this={fileInput}
          type="file"
          id="file"
          name="imageUpload"
          class="hidden"
          accept={authorizedExtensions.join(",")}
          multiple
          on:input={onFile(getFilesFromInputEvent)}
        />
        <button
          type="button"
          on:click={() => fileInput.click()}
          class="px-4 py-1 border border-blue-500 text-blue-500 rounded-sm">Select file</button
        >
      </label>
    {/if}

    <div class="flex items-center gap-4">
      <p class="text-blue-800 text-sm">{text.length} / 120</p>
      <button
        disabled={creating}
        class="max-w-max px-4 py-2 bg-pink-500 text-sun-50 hover:bg-pink-600 rounded-sm {creating
          ? 'disabled:bg-pink-300'
          : ''}"
      >
        {#if creating}
          Uploading...
        {:else}
          Submit <span>(⌘+enter)</span>
        {/if}
      </button>
    </div>
  </div>
</form>
