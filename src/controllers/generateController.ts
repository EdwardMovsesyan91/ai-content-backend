import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import { generateSchema } from "../schemas/generateSchemas";
import OpenAI from "openai";
import { Post } from "../models/Post";

export const generatePost = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const parsed = generateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const { topic, style } = parsed.data;
  const prompt = `Write a detailed blog post about "${topic}" in a "${style}" tone.`;

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const content = completion.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return res.status(500).json({ message: "Failed to generate content" });
    }

    const newPost = new Post({
      userId: req.user?.userId,
      title: topic,
      content,
      isDraft: true,
      isPublic: false,
    });

    await newPost.save();

    res.status(200).json({ post: newPost });
  } catch (error) {
    console.error("Error generating content:", error);
    res
      .status(500)
      .json({ message: "Error generating content, please try again" });
  }
};
