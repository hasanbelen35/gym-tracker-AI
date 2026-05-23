import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./lib/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "GymTrack API is running 🚀" });
});

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log("Connected to database successfully");
  console.log(`Server is running on port ${PORT}`);
});