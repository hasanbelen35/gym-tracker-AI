import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorMiddleware";
import sessionRouter from "./routes/session.route";
import cookieParser from "cookie-parser";
import gymRouter from "./routes/gym.route";
import trainerRouter from "./routes/trainer.routes";
import memberRouter from "./routes/member.routes";
import exercisesRouter from "./routes/workout.routes";
import morgan from "morgan";
import nutritionsRouter from "./routes/nutrition.routes";
import { logger } from "./config/logger";
import trainerAIRouter from "./routes/ai/trainer.ai.routes";
import memberAIRouter from "./routes/ai/member.ai.routes";
import gymAIRouter from "./routes/ai/gym.ai.routes";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
            "Origin",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        exposedHeaders: ["Set-Cookie"],
    })
);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later.",
    },
});

const morganStream = {
    write: (message: string) => logger.http(message.trim()),
};

const morganFormat =
    process.env.NODE_ENV === "production" ? "combined" : "dev";

app.use(express.json());
app.use(cookieParser());

app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin",
        },
    })
);

app.use("/api/", limiter);

app.use(
    morgan(morganFormat, {
        stream: morganStream,
    })
);

app.use("/api/auth", authRouter);
app.use("/api/session", sessionRouter);
app.use("/api/gym", gymRouter);
app.use("/api/trainer", trainerRouter);
app.use("/api/member", memberRouter);
app.use("/api/exercises", exercisesRouter);
app.use("/api/nutrition", nutritionsRouter);

app.use("/api/trainer/ai", trainerAIRouter);
app.use("/api/member/ai", memberAIRouter);
app.use("/api/gym/ai", gymAIRouter);

app.get("/", (req, res) => {
    res.json({
        message: "GymTrack API is running 🚀",
    });
});

app.use(errorHandler);

export default app;