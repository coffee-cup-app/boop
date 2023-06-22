import mime from "mime-types";
import type { RequestHandler } from "../$types";
import { getImage, getImagePath } from "../../../lib/db";

export const GET = (async ({ params }) => {
  const name = (params as any).name as string;
  const imagePath = getImagePath(name);

  try {
    const image = await getImage(name);
    const mimeType = mime.lookup(imagePath);

    if (!mimeType) {
      return new Response(JSON.stringify({ error: "Invalid mime-type" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    return new Response(image, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Image not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}) satisfies RequestHandler;
