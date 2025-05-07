import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import { savePostSchema } from "../schemas/postSchemas";
import { Post } from "../models/Post";
import sanitizeHtml from "sanitize-html";

export const savePost = async (req: AuthenticatedRequest, res: Response) => {
  const parsed = savePostSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const { title, content, isDraft = false, isPublic = true } = parsed.data;
  const userId = req.user?.userId;

  const cleanContent = sanitizeHtml(content);

  const newPost = await Post.create({
    userId,
    title,
    content: cleanContent,
    isDraft,
    isPublic,
  });

  res.status(201).json({ post: newPost });
};

export const getUserPosts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.userId;

  const posts = await Post.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({ posts });
};

export const getPublicPostById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post || post.isDraft || !post.isPublic) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.status(200).json({ post });
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, isDraft, isPublic } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.userId.toString() !== req.user?.userId) {
    return res
      .status(403)
      .json({ message: "Unauthorized: You cannot edit this post" });
  }

  post.title = title || post.title;
  post.content = content || post.content;
  post.isDraft = isDraft !== undefined ? isDraft : post.isDraft;
  post.isPublic = isPublic !== undefined ? isPublic : post.isPublic;

  await post.save();

  res.status(200).json({ message: "Post updated successfully", post });
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.userId.toString() !== req.user?.userId) {
    return res
      .status(403)
      .json({ message: "Unauthorized: You cannot delete this post" });
  }

  await post.deleteOne();

  res.status(200).json({ message: "Post deleted successfully" });
};

export const getAllPublicPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({
      isPublic: true,
      isDraft: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (err) {
    console.error("Failed to fetch public posts:", err);
    res.status(500).json({ message: "Failed to fetch public posts" });
  }
};
