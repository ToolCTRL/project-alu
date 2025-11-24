import fs from "fs";
import { marked } from "marked";
import path from "path";

export async function getMdxContent(fileName: string): Promise<string> {
  // Validate fileName to prevent path traversal attacks
  if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
    throw new Error("Invalid file name");
  }
  const filePath = path.join("./", "./app/blog/" + fileName + ".mdx");
  const content = fs.readFileSync(filePath, "utf8");
  return content;
}

export async function getMdxPosts(): Promise<{ slug: string; markdown: string }[]> {
  const items: { slug: string; markdown: string }[] = [];
  const dir = path.join("./", "./app/blog");
  const fileNames = fs.readdirSync(dir);
  fileNames.forEach((file) => {
    // Validate file name to prevent path traversal
    if (file.includes("..") || file.includes("/") || file.includes("\\")) {
      return;
    }
    if (path.parse(file).ext === ".mdx") {
      const slug = path.parse(file).name;
      const content = fs.readFileSync(path.join(dir, file), "utf8");
      items.push({
        slug,
        markdown: marked(content),
      });
    }
  });
  return items;
}
