import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/db";

export class AuthService {
  // --- GYM METHODS ---

  // REGISTER GYM
  async registerGym(data: {
    name: string;
    email: string;
    password: string;
    address?: string;
    phone?: string;
  }) {
    const existing = await prisma.gym.findUnique({ where: { email: data.email } });
    if (existing) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const gym = await prisma.gym.create({
      data: { ...data, password: hashedPassword },
    });

    return { gym: { id: gym.id, name: gym.name, email: gym.email } };
  }
  // LOGIN GYM
  async loginGym(data: { email: string; password: string }) {
    const gym = await prisma.gym.findUnique({ where: { email: data.email } });
    if (!gym) throw new Error("Gym not found");

    const valid = await bcrypt.compare(data.password, gym.password);
    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign({ id: gym.id, role: "gym", name: gym.name }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return { token, gym: { id: gym.id, name: gym.name, email: gym.email } };
  }


  // --- MEMBER METHODS ---

  async registerMember(data: {
    name: string;
    surname: string;
    email: string;
    password: string;
    gymId: number;
  }) {
    const existing = await prisma.member.findUnique({ where: { email: data.email } });
    if (existing) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const member = await prisma.member.create({
      data: { ...data, password: hashedPassword },
    });

    return { member: { id: member.id, name: member.name, email: member.email } };
  }

  // LOGIN MEMBER
  // LOGIN MEMBER
  async loginMember(data: { email: string; password: string }) {

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
        gym: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!member) {
      throw new Error("Member not found");
    }

    // PASSWORD CHECK
    const valid = await bcrypt.compare(data.password, member.password);

    if (!valid) {
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
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return {
      token,
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        gymId: member.gymId,
        gymName: member.gym?.name
      }
    };
  }

}