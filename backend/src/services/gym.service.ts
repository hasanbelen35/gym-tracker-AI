import prisma from "../lib/db";

export class GymService {
    async getAllGymData() {
        const gyms = await prisma.gym.findMany({
            select: { id: true, name: true }
        });
        return gyms;
    }

    // get all members from db
    async getAllMembers() {
        const members = await prisma.member.findMany({
            select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                gymId: true,
            }
        });
        return members;
    }

    // get all trainers from db
    async getAllTrainers() {
        const trainers = await prisma.trainer.findMany({
            select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                gymId: true,
            }
        });
        return trainers;
    }
}