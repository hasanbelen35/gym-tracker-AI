import prisma from "../lib/db";

export class GymService {
    async getAllGymData() {
        const gyms = await prisma.gym.findMany({
            select: { id: true, name: true }
        });
        return gyms;
    }

    // ----------------------------------------MEMBER-----------------------------------------
    async getAllMembers() {
        const members = await prisma.member.findMany({
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                gymId: true,
                assignmentStatus: true,
                // get trainer's data
                trainer: {
                    select: {
                        name: true,
                        surname: true,
                    }
                }
            }

        });
        return members;

    }

    async removeMemberFromGym(gymId: number, memberPublicId: string) {
        return prisma.$transaction(async (tx) => {
            const member = await tx.member.findFirst({
                where: { publicId: memberPublicId, gymId }
            });

            if (!member) {
                throw new Error("Member not found in this gym");
            }

            await tx.session.deleteMany({ where: { memberId: member.id } });
            await tx.program.deleteMany({ where: { memberId: member.id } });

            return tx.member.delete({ where: { id: member.id } });
        });
    }

    async getMemberDetail(gymId: number, memberPublicId: string) {
        const member = await prisma.member.findFirst({
            where: { publicId: memberPublicId, gymId },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                age: true,
                height: true,
                weight: true,
                phone: true,
                createdAt: true,
                trainer: {
                    select: { id: true, publicId: true, name: true, surname: true }
                },
                sessions: {
                    orderBy: { checkIn: "desc" },
                    take: 20,
                    select: {
                        id: true,
                        checkIn: true,
                        checkOut: true,
                        duration: true
                    }
                },
                programs: {
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        type: true,
                        content: true,
                        createdAt: true
                    }
                }
            }
        });

        if (!member) {
            throw new Error("Member not found in this gym");
        }

        return member;
    }

    //----------------------------------------TRAINER----------------------------------------

    async getAllTrainers() {
        const trainers = await prisma.trainer.findMany({
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                gymId: true,
            }
        });
        return trainers;
    }

    async removeTrainerFromGym(gymId: number, trainerPublicId: string) {
        return prisma.$transaction(async (tx) => {
            const trainer = await tx.trainer.findFirst({
                where: { publicId: trainerPublicId, gymId }
            });

            if (!trainer) {
                throw new Error("Trainer not found in this gym");
            }

          await tx.member.updateMany({
            where: {
                trainer: { publicId: trainerPublicId }
            },
            data: {
                assignmentStatus: 'UNASSIGNED',
                trainerId: null 
            }
        });

            await tx.program.deleteMany({ where: { trainerId: trainer.id } });

            return tx.trainer.delete({ where: { id: trainer.id } });
        });
    }

    async getTrainerDetail(gymId: number, trainerPublicId: string) {
        const trainer = await prisma.trainer.findFirst({
            where: { publicId: trainerPublicId, gymId },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                createdAt: true,
                myMembers: {
                    select: { id: true, publicId: true, name: true, surname: true, email: true }
                },
                programs: {
                    orderBy: { createdAt: "desc" },
                    take: 20,
                    select: {
                        id: true,
                        type: true,
                        content: true,
                        createdAt: true,
                        member: {
                            select: { id: true, publicId: true, name: true, surname: true }
                        }
                    }
                }
            }
        });

        if (!trainer) {
            throw new Error("Trainer not found in this gym");
        }

        return trainer;
    }

    // TO APPROVE TRAINER'S MEMBER ASSINGMINET
    async approveMemberAssignment(memberPublicId: string, gymId: number) {
        return await prisma.member.updateMany({
            where: {
                publicId: memberPublicId,
                gymId: gymId,
                assignmentStatus: 'PENDING',
            },
            data: {
                assignmentStatus: 'ASSIGNED',
            }
        });
    }

    // TO REJECT TRAINER'S MEMBER ASSINGMINET
    async rejectMemberAssignment(memberPublicId: string, gymId: number) {
        return await prisma.member.updateMany({
            where: {
                publicId: memberPublicId,
                gymId: gymId,
                assignmentStatus: 'PENDING',
            },
            data: {
                trainerId: null,
                assignmentStatus: 'UNASSIGNED',
            }
        });
    }
    // get member by status
    // GET MEMBERS BY ASSIGNMENT STATUS (gym'in tüm üyeleri arasından filtreli)
    async getMembersByStatus(gymId: number, status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED') {
        return await prisma.member.findMany({
            where: {
                gymId: gymId,
                assignmentStatus: status,
            },
            select: {
                publicId: true,
                name: true,
                surname: true,
                email: true,
                assignmentStatus: true,
                trainer: {
                    select: {
                        name: true,
                        surname: true,
                    }
                }
            }
        });
    }
}