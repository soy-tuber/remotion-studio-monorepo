import { z } from "zod";

export const SceneSchema = z.object({
  type: z.string(),
  title: z.string(),
  content: z.string(),
  script: z.string(),
  code: z.string().optional(),
  highlightLines: z.array(z.number()).optional(),
});

export const VideoDataSchema = z.object({
  title: z.string(),
  scenes: z.array(SceneSchema),
});

export type Scene = z.infer<typeof SceneSchema>;
export type VideoData = z.infer<typeof VideoDataSchema>;
