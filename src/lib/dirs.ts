import fs from "fs";
import path from "path";

export const getDirectorySizeBytes = (directoryPath: string): number => {
  const stats = fs.statSync(directoryPath);
  let totalSize = 0;

  if (stats.isDirectory()) {
    const dirContent = fs.readdirSync(directoryPath);
    for (const item of dirContent) {
      totalSize += getDirectorySizeBytes(path.join(directoryPath, item));
    }
  } else {
    totalSize += stats.size;
  }

  return totalSize;
};
