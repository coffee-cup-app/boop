# Persistent Volume Playground

![screenshot-2023-06-14-15 57 38](https://github.com/railwayapp/persistent-volume-playground/assets/3044853/61140a03-2050-4432-aff0-7cbf24906710)

This is a Svelte project intended to be used to test persistent volumes on Railway. It is a feed where you can add text and/or image(s). Everything is persistent to the attached volume (if it exists).

## Deploying

You should be able to just deploy this straight to Railway without changing anything. The only thing that is required is that the `RAILWAY_STATIC_URL` environment variable exists since it is needed by the Svelte node-adapter.

## Running locally

```bash
pnpm install
pnpm run dev
```
