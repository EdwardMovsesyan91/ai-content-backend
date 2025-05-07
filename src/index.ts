import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes";
import generateRoutes from "./routes/generateRoutes";
import postRoutes from "./routes/postRoutes";
import swaggerUi from "swagger-ui-express";
import { swaggerDocumentation } from "./swaggerDocs"; // Import Swagger Docs

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

// ===== Middleware =====
app.use(
  cors({
    origin: [
      "https://my-ai-content.vercel.app",
      "https://ai-content-frontend-zeta.vercel.app",
      "http://localhost:5173",
      "https://your-frontend.vercel.app",
      "https://ai-content-backend-production.up.railway.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(helmet()); // Secure HTTP headers
app.use(morgan("dev")); // Log requests to console
app.use(express.json()); // Parse incoming JSON
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/generate", generateRoutes);
app.use("/api/posts", postRoutes);

// ===== Swagger Documentation =====
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));

// ===== Health Check Route =====
app.get("/", (_req: Request, res: Response) => {
  res.send("AI-Powered Content Generator API is running...");
});

// ===== Global Error Handler =====
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  });
});

// ===== Start Server & Connect to MongoDB =====
mongoose
  .connect(MONGO_URI, { dbName: "ai-content-db" })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(
        `🚀 Server running at http://localhost:${PORT} OR http://localhost:${PORT}/api-docs/`
      );
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
