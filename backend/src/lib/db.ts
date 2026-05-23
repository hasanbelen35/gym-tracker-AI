import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$connect()
  .then(() => console.log("Connected to database successfully"))
  .catch((err:any) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });

export default prisma;