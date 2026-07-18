import prisma from "../lib/db";

export class GymService {
    async getAllGymData() {
        const gyms = await prisma.gym.findMany({
            select: { id: true, name: true }
        });
        return gyms;
    }
    // ----------------------------------------MEMBER-----------------------------------------
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
    // use transaction for safe delete
    async removeMemberFromGym(gymId: number, memberId: number) {
        return prisma.$transaction(async (tx) => {
            const member = await tx.member.findFirst({
                where: { id: memberId, gymId }
            });

            if (!member) {
                throw new Error("Member not found in this gym");
            }

            await tx.session.deleteMany({ where: { memberId } });
            await tx.program.deleteMany({ where: { memberId } });

            return tx.member.delete({ where: { id: memberId } });
        });
    }



    //----------------------------------------TRAINER----------------------------------------

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
    // use transaction for safe delete
    async removeTrainerFromGym(gymId: number, trainerId: number) {
        return prisma.$transaction(async (tx) => {
            const trainer = await tx.trainer.findFirst({
                where: { id: trainerId, gymId }
            });

            if (!trainer) {
                throw new Error("Trainer not found in this gym");
            }

            // leave members assigned from trainer don't delete
            await tx.member.updateMany({
                where: { trainerId },
                data: { trainerId: null }
            });

            await tx.program.deleteMany({ where: { trainerId } });

            return tx.trainer.delete({ where: { id: trainerId } });
        });
    }
}

