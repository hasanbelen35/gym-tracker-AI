import app from "./app";
import prisma from "./lib/db";
import { logger } from './config/logger';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    logger.info(`Database connected successfully.`);
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    logger.error(`Failed to connect to the database: ${error}`);
    process.exit(1);
  }
});