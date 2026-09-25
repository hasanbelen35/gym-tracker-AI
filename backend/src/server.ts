import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import prisma from "./lib/db";
import { logger } from "./config/logger";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await prisma.$connect();

        logger.info("Database connected successfully.");

        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error}`);
        process.exit(1);
    }
};

startServer();