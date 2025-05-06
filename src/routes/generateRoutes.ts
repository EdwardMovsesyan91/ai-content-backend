import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { asyncHandler } from "../utils/asyncHandler";
import { generatePost } from "../controllers/generateController";

const router = Router();

router.post("/", verifyToken, asyncHandler(generatePost));

export default router;
