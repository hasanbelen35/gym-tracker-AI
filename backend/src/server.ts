import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./lib/db";
import authRouter from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import sessionRouter from "./routes/session.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/session", sessionRouter);
app.get("/", (req, res) => {
  res.json({ message: "GymTrack API is running 🚀" });
});

app.use(errorHandler);

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log("Connected to database successfully");
  console.log(`Server is running on port ${PORT}`);
});