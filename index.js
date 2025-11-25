import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./Config/connectDB.js";
import router from "./Router/userRouter.js";
import profilerouter from "./Router/profileRouter.js";
import adminRouter from "./Router/adminRouter.js";
import advertRouter from "./Router/advertRouter.js";
import youtubeRouter from "./Router/youtubeRouter.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

connectDB();

// CORS configuration - Allow frontend to access backend
app.use(
  cors({
    origin: [
      "https://preschollfrontend.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", router);
app.use("/api/profile", profilerouter);
app.use("/api/admin", adminRouter);
app.use("/api/ads", advertRouter);
app.use("/api/youtube", youtubeRouter);

// Alternative routes for frontend compatibility
app.use("/ads", advertRouter);
app.use("/profile", profilerouter);
app.use("/profiles", profilerouter);
app.use("/youtube", youtubeRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => {
  console.log("Server starting on port " + port);
});
