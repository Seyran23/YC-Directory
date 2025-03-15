import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(20),
  link: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .refine(
      async (url) => {
        try {
          const res = await fetch(url, { method: "HEAD" });
          const contentType = res.headers.get("content-type");
          return contentType?.startsWith("image/") ? true : false;
        } catch {
          return false;
        }
      },
      { message: "URL must point to an image file." }
    ),

  pitch: z.string().min(10),
});
