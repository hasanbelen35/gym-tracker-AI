import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/db";

export class AuthService {
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

    const token = jwt.sign({ id: gym.id, role: "gym" }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return { token, gym: { id: gym.id, name: gym.name, email: gym.email } };
  }

  async loginGym(data: { email: string; password: string }) {
    const gym = await prisma.gym.findUnique({ where: { email: data.email } });
    if (!gym) throw new Error("Gym not found");

    const valid = await bcrypt.compare(data.password, gym.password);
    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign({ id: gym.id, role: "gym" }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return { token, gym: { id: gym.id, name: gym.name, email: gym.email } };
  }

  async registerMember(data: {
    name: string;
    surname: string;
    email: string;
    password: string;
    gymId: number;
    age?: number;
    height?: number;
    weight?: number;
    phone?: string;
  }) {
    const existing = await prisma.member.findUnique({ where: { email: data.email } });
    if (existing) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const member = await prisma.member.create({
      data: { ...data, password: hashedPassword },
    });

    const token = jwt.sign({ id: member.id, role: "member" }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return { token, member: { id: member.id, name: member.name, email: member.email } };
  }

  async loginMember(data: { email: string; password: string }) {
    const member = await prisma.member.findUnique({ where: { email: data.email } });
    if (!member) throw new Error("Member not found");

    const valid = await bcrypt.compare(data.password, member.password);
    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign({ id: member.id, role: "member" }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return { token, member: { id: member.id, name: member.name, email: member.email } };
  }
}