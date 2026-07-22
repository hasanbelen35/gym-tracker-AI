import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./lib/db";
import authRouter from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import sessionRouter from "./routes/session.route";
import cookieParser from "cookie-parser";
import gymRouter from "./routes/gym.route";
import trainerRouter from './routes/trainer.routes';
import memberRouter from './routes/member.routes';
import exercisesRouter from './routes/workout.routes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposedHeaders: ["Set-Cookie"]
}));


app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/session", sessionRouter);
app.use("/api/gym", gymRouter);
app.use("/api/trainer", trainerRouter);
app.use("/api/member", memberRouter);
app.use("/api/exercises", exercisesRouter);

app.get("/", (req, res) => {
  res.json({ message: "GymTrack API is running 🚀" });
});

app.use(errorHandler);

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Server is running on port ${PORT}`);
});