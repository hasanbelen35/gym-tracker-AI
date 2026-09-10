import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/db";
import { logger } from "../config/logger";

export class AuthService {
  // Global email uniqueness check across all user types (Gym, Member, Trainer)
  private async isEmailTaken(email: string): Promise<boolean> {
    const [gym, member, trainer] = await Promise.all([
      prisma.gym.findUnique({ where: { email } }),
      prisma.member.findUnique({ where: { email } }),
      prisma.trainer.findUnique({ where: { email } }),
    ]);
    return !!(gym || member || trainer);
  }

  // ----------------------------------------------------- GYM METHODS -----------------------------------------------------

  // REGISTER GYM
  async registerGym(data: {
    name: string;
    email: string;
    password: string;
    address?: string;
    phone?: string;
  }) {
    logger.info(`Attempting to register gym with email: ${data.email}`);
    
    if (await this.isEmailTaken(data.email)) {
      logger.warn(`Gym registration failed: Email already exists - ${data.email}`);
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const gym = await prisma.gym.create({
      data: { ...data, password: hashedPassword },
    });

    logger.info(`Gym successfully registered with ID: ${gym.id}`);
    return { gym: { id: gym.id, name: gym.name, email: gym.email } };
  }
  // LOGIN GYM
  async loginGym(data: { email: string; password: string }) {
    logger.info(`Gym login attempt for email: ${data.email}`);

    const gym = await prisma.gym.findUnique({ where: { email: data.email } });
    if (!gym) {
      logger.warn(`Gym login failed: Gym not found for email - ${data.email}`);
      throw new Error("Gym not found");
    }

    const valid = await bcrypt.compare(data.password, gym.password);
    if (!valid) {
      logger.warn(`Gym login failed: Invalid password for email - ${data.email}`);
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: gym.id, role: "gym", name: gym.name }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    logger.info(`Gym successfully logged in: ID ${gym.id}`);
    return { token, gym: { id: gym.id, name: gym.name, email: gym.email } };
  }


  // ----------------------------------------------------- MEMBER METHODS -----------------------------------------------------

  async registerMember(data: {
    name: string;
    surname: string;
    email: string;
    password: string;
    gymId: number;
  }) {
    logger.info(`Attempting to register member with email: ${data.email}, gymId: ${data.gymId}`);

    if (await this.isEmailTaken(data.email)) {
      logger.warn(`Member registration failed: Email already exists - ${data.email}`);
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const member = await prisma.member.create({
      data: { ...data, password: hashedPassword },
    });

    logger.info(`Member successfully registered with ID: ${member.id}`);
    return { member: { id: member.id, name: member.name, email: member.email } };
  }

  // LOGIN MEMBER
  async loginMember(data: { email: string; password: string }) {
    logger.info(`Member login attempt for email: ${data.email}`);

    const member = await prisma.member.findUnique({
      where: {
        email: data.email
      },
      select: {
        id: true,
        name: true,
        surname: true,
        password: true,
        email: true,
        gymId: true,
        isProfileCompleted: true,
        gym: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!member) {
      logger.warn(`Member login failed: Member not found for email - ${data.email}`);
      throw new Error("Member not found");
    }

    // PASSWORD CHECK
    const valid = await bcrypt.compare(data.password, member.password);

    if (!valid) {
      logger.warn(`Member login failed: Invalid password for email - ${data.email}`);
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      {
        id: member.id,
        gymId: member.gymId,
        gymName: member.gym?.name,
        role: "member",
        name: member.name,
        surname: member.surname,
        isProfileCompleted: member.isProfileCompleted
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    logger.info(`Member successfully logged in: ID ${member.id}`);
    return {
      token,
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        gymId: member.gymId,
        gymName: member.gym?.name,
        isProfileCompleted: member.isProfileCompleted 
        
      }
    };
  }

  // ----------------------------------------------------- TRAINER METHODS -----------------------------------------------------


  // REGISTER TRAINER
  async registerTrainer(data: {
    name: string;
    surname: string;
    email: string;
    password: string;
    gymId: number;
  }) {
    logger.info(`Attempting to register trainer with email: ${data.email}, gymId: ${data.gymId}`);

    if (await this.isEmailTaken(data.email)) {
      logger.warn(`Trainer registration failed: Email already exists - ${data.email}`);
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const trainer = await prisma.trainer.create({
      data: { ...data, password: hashedPassword },
    });

    logger.info(`Trainer successfully registered with ID: ${trainer.id}`);
    return { trainer: { id: trainer.id, name: trainer.name, email: trainer.email } };
  }

  // LOGIN TRAINER
  async loginTrainer(data: { email: string; password: string }) {
    logger.info(`Trainer login attempt for email: ${data.email}`);

    const trainer = await prisma.trainer.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        name: true,
        surname: true,
        password: true,
        email: true,
        gymId: true,
        isProfileCompleted: true,
        gym: {
          select: {
            name: true,
            publicId: true,
          },
        },
      },
    });

    if (!trainer) {
      logger.warn(`Trainer login failed: Trainer not found for email - ${data.email}`);
      throw new Error("Trainer not found");
    }

    const valid = await bcrypt.compare(data.password, trainer.password);

    if (!valid) {
      logger.warn(`Trainer login failed: Invalid password for email - ${data.email}`);
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      {
        id: trainer.id,
        gymId: trainer.gymId,
        gymPublicId: trainer.gym?.publicId,
        gymName: trainer.gym?.name,
        role: "trainer",
        name: trainer.name,
        surname: trainer.surname,
        isProfileCompleted: trainer.isProfileCompleted,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    logger.info(`Trainer successfully logged in: ID ${trainer.id}`);
    return {
      token,
      trainer: {
        id: trainer.id,
        name: trainer.name,
        email: trainer.email,
        gymId: trainer.gymId,
        gymName: trainer.gym?.name,
        isProfileCompleted: trainer.isProfileCompleted, 
      },
    };
  }

}