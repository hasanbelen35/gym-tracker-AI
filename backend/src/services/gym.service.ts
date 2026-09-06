import prisma from "../lib/db";
import { logger } from "../config/logger";

export class GymService {
    async getAllGymData() {
        logger.info("Fetching all gyms data");
        const gyms = await prisma.gym.findMany({
            select: { id: true, name: true }
        });
        logger.info(`Successfully fetched ${gyms.length} gyms`);
        return gyms;
    }

    // ----------------------------------------MEMBER-----------------------------------------
    async getAllMembers() {
        logger.info("Fetching all members across gyms");
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
        logger.info(`Successfully fetched ${members.length} members`);
        return members;

    }

    async removeMemberFromGym(gymId: number, memberPublicId: string) {
        logger.info(`Attempting to remove member with publicId: ${memberPublicId} from gymId: ${gymId}`);
        return prisma.$transaction(async (tx) => {
            const member = await tx.member.findFirst({
                where: { publicId: memberPublicId, gymId }
            });

            if (!member) {
                logger.warn(`Member removal failed: Member not found with publicId: ${memberPublicId} in gymId: ${gymId}`);
                throw new Error("Member not found in this gym");
            }

            await tx.session.deleteMany({ where: { memberId: member.id } });
            await tx.program.deleteMany({ where: { memberId: member.id } });

            const deletedMember = await tx.member.delete({ where: { id: member.id } });
            logger.info(`Member successfully removed with ID: ${member.id} from gymId: ${gymId}`);
            return deletedMember;
        });
    }

    async getMemberDetail(gymId: number, memberPublicId: string) {
        logger.info(`Fetching details for member publicId: ${memberPublicId} in gymId: ${gymId}`);
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
            logger.warn(`Member detail fetch failed: Member not found with publicId: ${memberPublicId} in gymId: ${gymId}`);
            throw new Error("Member not found in this gym");
        }

        logger.info(`Successfully fetched details for member ID: ${member.id}`);
        return member;
    }

    //----------------------------------------TRAINER----------------------------------------

    async getAllTrainers() {
        logger.info("Fetching all trainers");
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
        logger.info(`Successfully fetched ${trainers.length} trainers`);
        return trainers;
    }

    async removeTrainerFromGym(gymId: number, trainerPublicId: string) {
        logger.info(`Attempting to remove trainer with publicId: ${trainerPublicId} from gymId: ${gymId}`);
        return prisma.$transaction(async (tx) => {
            const trainer = await tx.trainer.findFirst({
                where: { publicId: trainerPublicId, gymId }
            });

            if (!trainer) {
                logger.warn(`Trainer removal failed: Trainer not found with publicId: ${trainerPublicId} in gymId: ${gymId}`);
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

            const deletedTrainer = await tx.trainer.delete({ where: { id: trainer.id } });
            logger.info(`Trainer successfully removed with ID: ${trainer.id} from gymId: ${gymId}`);
            return deletedTrainer;
        });
    }

    async getTrainerDetail(gymId: number, trainerPublicId: string) {
        logger.info(`Fetching details for trainer publicId: ${trainerPublicId} in gymId: ${gymId}`);
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
            logger.warn(`Trainer detail fetch failed: Trainer not found with publicId: ${trainerPublicId} in gymId: ${gymId}`);
            throw new Error("Trainer not found in this gym");
        }

        logger.info(`Successfully fetched details for trainer ID: ${trainer.id}`);
        return trainer;
    }

    // TO APPROVE TRAINER'S MEMBER ASSINGMINET
    async approveMemberAssignment(memberPublicId: string, gymId: number) {
        logger.info(`Approving member assignment for member publicId: ${memberPublicId} in gymId: ${gymId}`);
        const result = await prisma.member.updateMany({
            where: {
                publicId: memberPublicId,
                gymId: gymId,
                assignmentStatus: 'PENDING',
            },
            data: {
                assignmentStatus: 'ASSIGNED',
            }
        });
        logger.info(`Member assignment successfully approved for publicId: ${memberPublicId}`);
        return result;
    }

    // TO REJECT TRAINER'S MEMBER ASSINGMINET
    async rejectMemberAssignment(memberPublicId: string, gymId: number) {
        logger.info(`Rejecting member assignment for member publicId: ${memberPublicId} in gymId: ${gymId}`);
        const result = await prisma.member.updateMany({
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
        logger.info(`Member assignment successfully rejected for publicId: ${memberPublicId}`);
        return result;
    }
    // get member by status
    // GET MEMBERS BY ASSIGNMENT STATUS 
    async getMembersByStatus(gymId: number, status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED') {
        logger.info(`Fetching members by status: ${status} for gymId: ${gymId}`);
        const members = await prisma.member.findMany({
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
        logger.info(`Successfully fetched ${members.length} members with status ${status}`);
        return members;
    }
}