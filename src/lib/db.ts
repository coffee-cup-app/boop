import fs from "fs";
import { nanoid } from "nanoid";
import { Config, JsonDB } from "node-json-db";
import path from "path";
import z from "zod";

const envSchema = z.object({
  RAILWAY_VOLUME_NAME: z.string().default("<local>"),
  RAILWAY_VOLUME_MOUNT_PATH: z.string().default(`./data`),
  RAILWAY_SERVICE_NAME: z.string().optional(),
  ORIGIN: z.string().optional(),
  NODE_ENV: z.string().default("development")
});

const textSchema = z.string().max(120).default("");

export const env = envSchema.parse(process.env);

console.log(env);

export const dataDirectory = env.RAILWAY_VOLUME_MOUNT_PATH;

export const imagesDir = path.join(dataDirectory, "images");
export const filesDir = path.join(dataDirectory, "files");

// Ensure the directories exist
fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(filesDir, { recursive: true });

const dbFile = path.join(dataDirectory, "db.json");
console.log(`db file path: ${dbFile}`);

const db = new JsonDB(new Config(dbFile, true, true, "/"));

export interface Post {
  id: string;
  createdAt: number;
  text?: string;
  images: string[];
  files: string[];
}

export const createPost = async (text: string, images: string[]): Promise<Post> => {
  const id = nanoid();

  const filesToCreate = extractDiskSizes(text);
  const files = await Promise.all(filesToCreate.map((sizeMB) => createFileOfSize(sizeMB)));

  text = textSchema.parse(text);

  const post: Post = { id, text, images, createdAt: new Date().getTime(), files };

  db.push(`/posts/${id}`, post);

  return post;
};

export const getPosts = async (): Promise<Post[]> => {
  const postsDb = await db.getObjectDefault<Record<string, Post>>("/posts", {});
  return Object.values(postsDb).sort((a: Post, b: Post) => b.createdAt - a.createdAt);
};

export const getPost = async (id: string) => {
  const post = await db.getObject<Post>(`/posts/${id}`);
  return post;
};

export const deletePost = async (id: string) => {
  const post = await getPost(id);

  post.images.forEach((image) => {
    fs.unlinkSync(getImagePath(image));
  });
  (post.files ?? []).forEach((file) => {
    fs.unlinkSync(getFilePath(file));
  });

  await db.delete(`/posts/${id}`);
};

export const getImagePath = (name: string) => {
  return path.join(imagesDir, name);
};

export const getFilePath = (name: string) => {
  return path.join(filesDir, name);
};

export const saveImage = async (image: File): Promise<string> => {
  const ext = path.extname(image.name);
  const name = `${nanoid()}${ext}`;
  const fileName = getImagePath(name);

  console.log("Saving image", { fileName });

  fs.writeFileSync(fileName, Buffer.from(await image.arrayBuffer()));

  return name;
};

export const getImage = async (name: string): Promise<Buffer> => {
  const fileName = getImagePath(name);
  const data = fs.readFileSync(fileName);
  return data;
};

const extractDiskSizes = (blob: string): number[] => {
  // Define the pattern to match disk sizes
  const pattern = /(!(\d+(\.\d+)?)(MB|GB|mb|gb))/gi;

  // Find all matches
  const matches = blob.match(pattern) || [];

  // Map the matches to their sizes in MB
  const sizes = matches.map((match) => {
    // Remove the leading '!'
    const withoutExclamation = match.slice(1);

    // Split into value and unit
    const [value, unit] = withoutExclamation.split(/(MB|GB)/i);

    // Convert value to number
    let size = parseFloat(value);

    // Convert size to MB based on unit
    if (unit.toUpperCase() === "GB") {
      size *= 1000;
    }

    return size;
  });

  return sizes;
};

export const createFileOfSize = async (sizeMB: number) => {
  const filename = `${nanoid()}-${sizeMB}`;

  console.log(`Creating file of size ${sizeMB}MB`);

  // Create a buffer with the desired size in bytes
  const buffer = Buffer.alloc(sizeMB * 1024 * 1024);

  // Write the buffer to a file
  await fs.promises.writeFile(getFilePath(filename), buffer);

  return filename;
};
