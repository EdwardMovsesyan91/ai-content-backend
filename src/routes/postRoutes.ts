import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { asyncHandler } from "../utils/asyncHandler";
import {
  deletePost,
  getAllPublicPosts,
  getPublicPostById,
  getUserPosts,
  savePost,
  updatePost,
} from "../controllers/postController";

const router = Router();

router.post("/save", verifyToken, asyncHandler(savePost));
router.get("/user", verifyToken, asyncHandler(getUserPosts));
router.get("/public", asyncHandler(getAllPublicPosts));
router.get("/:id", asyncHandler(getPublicPostById));
router.put("/:id", verifyToken, asyncHandler(updatePost));
router.delete("/:id", verifyToken, asyncHandler(deletePost));

export default router;
