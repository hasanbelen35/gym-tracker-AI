import prisma from "../lib/db";
import { logger } from "../config/logger";
import { Http } from "winston/lib/winston/transports";
import { AppError } from "../middleware/errorMiddleware";

export class GymService {

    // TODO : WILL FIX LATER

    async getAllGymData() {
        logger.info("Fetching all gyms data");
        const gyms = await prisma.gym.findMany({
            select: { id: true, name: true }
        });
        logger.info(`Successfully fetched ${gyms.length} gyms`);
        return gyms;
    }

    // ----------------------------------------MEMBER-----------------------------------------
    async getAllMembers(gymId: number) {
        AppError.assertGym(gymId);


        logger.info(`Fetching members for  in gym ${gymId}`);

        const members = await prisma.member.findMany({
            where: {
                gymId: gymId,
            },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                gymId: true,
                assignmentStatus: true,
                trainer: {
                    select: {
                        name: true,
                        surname: true,
                    }
                }
            }
        });

        logger.info(`Successfully fetched ${members.length} members for trainer`);
        return members;
    }

    async removeMemberFromGym(gymId: number, memberPublicId: string) {

        // PARAMETER CHECK
        AppError.assertGym(gymId);
        AppError.assertMemberPublicId(memberPublicId);

        logger.info(`Attempting to remove member with publicId: ${memberPublicId} from gymId: ${gymId}`);
        return prisma.$transaction(async (tx) => {
            const member = await tx.member.findFirst({
                where: { publicId: memberPublicId, gymId }
            });

            if (!member) {
                logger.warn(`Member removal failed: Member not found with publicId: ${memberPublicId} in gymId: ${gymId}`);
                throw new AppError(404, 'Aradığınız kullanıcı sistemde bulunamadı.');
            }

            await tx.session.deleteMany({ where: { memberId: member.id } });
            await tx.program.deleteMany({ where: { memberId: member.id } });

            const deletedMember = await tx.member.delete({ where: { id: member.id } });
            logger.info(`Member successfully removed with ID: ${member.id} from gymId: ${gymId}`);
            return deletedMember;
        });
    }
    // GET MEMBER DETAIL SERVICE
    async getMemberDetail(gymId: number, memberPublicId: string) {
        // PARAMETER CHECK
        AppError.assertGym(gymId);
        AppError.assertMemberPublicId(memberPublicId);


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
                    take: 10,
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
            throw new AppError(404, 'Aradığınız kullanıcı sistemde bulunamadı.');
        }

        logger.info(`Successfully fetched details for member ID: ${member.id}`);
        return member;
    }

    // GET ALL TRAINER FROM GYM SERVICE
    async getAllTrainers(gymId: number) {
        //  PARAMETER CHECK
        AppError.assertGym(gymId);

        logger.info(`Fetching all trainers for gymId: ${gymId}`);

        const trainers = await prisma.trainer.findMany({
            where: {
                gymId: gymId
            },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                gymId: true,
            }
        });

        logger.info(`Successfully fetched ${trainers.length} trainers for gymId: ${gymId}`);
        return trainers;
    }

    // REMOVE TRAINER FROM GYM SERVICE
    async removeTrainerFromGym(gymId: number, trainerPublicId: string) {
        // PARAMETER CHECK
        AppError.assertGym(gymId);
        AppError.assertTrainerPublicId(trainerPublicId);

        logger.info(`Attempting to remove trainer with publicId: ${trainerPublicId} from gymId: ${gymId}`);

        return prisma.$transaction(async (tx) => {
            const trainer = await tx.trainer.findFirst({
                where: { publicId: trainerPublicId, gymId }
            });

            if (!trainer) {
                logger.warn(`Trainer removal failed: Trainer not found with publicId: ${trainerPublicId} in gymId: ${gymId}`);
                throw new AppError(404, "Eğitmen bu salonda bulunamadı.");
            }

            await tx.member.updateMany({
                where: {
                    gymId: gymId,
                    trainerId: trainer.id
                },
                data: {
                    assignmentStatus: 'UNASSIGNED',
                    trainerId: null
                }
            });

            await tx.program.deleteMany({
                where: { trainerId: trainer.id }
            });

            const deletedTrainer = await tx.trainer.delete({
                where: { id: trainer.id }
            });

            logger.info(`Trainer successfully removed with ID: ${trainer.id} from gymId: ${gymId}`);
            return deletedTrainer;
        });
    }

    // GET TRAINER DETAILED DATA SERVICE
    async getTrainerDetail(gymId: number, trainerPublicId: string) {
        // PARAMETER CHECK
        AppError.assertGym(gymId);
        AppError.assertTrainerPublicId(trainerPublicId);

        logger.info(`Fetching details for trainer publicId: ${trainerPublicId} in gymId: ${gymId}`);

        const trainer = await prisma.trainer.findFirst({
            where: { publicId: trainerPublicId, gymId },
            select: {
                id: true,
                publicId: true,
                avatarUrl: true,
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
                        title: true,
                        splitType: true,
                        isActive: true,
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
            throw new AppError(404, "Aradığınız eğitmen bu salonda bulunamadı.");
        }

        logger.info(`Successfully fetched details for trainer ID: ${trainer.id}`);
        return trainer;
    }
    // TO APPROVE TRAINER'S MEMBER ASSIGNMENT
    async approveMemberAssignment(memberPublicId: string, gymId: number) {
        // PARAMETER CHECK

        AppError.assertGym(gymId);
        AppError.assertMemberPublicId(memberPublicId);

        logger.info(`Approving member assignment for member publicId: ${memberPublicId} in gymId: ${gymId}`);

        const member = await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                gymId: gymId,
            }
        });

        if (!member) {
            logger.warn(`Member assignment approval failed: Member not found with publicId: ${memberPublicId} in gymId: ${gymId}`);
            throw new AppError(404, "Üye bu salonda bulunamadı.");
        }

        if (member.assignmentStatus !== 'PENDING') {
            logger.warn(`Member assignment approval failed: Status is not PENDING (${member.assignmentStatus}) for publicId: ${memberPublicId}`);
            throw new AppError(400, "Sadece onay bekleyen (PENDING) talepler onaylanabilir.");
        }

        const updatedMember = await prisma.member.update({
            where: { id: member.id },
            data: {
                assignmentStatus: 'ASSIGNED',
            },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                assignmentStatus: true,
                trainerId: true
            }
        });

        logger.info(`Member assignment successfully approved for publicId: ${memberPublicId}`);
        return updatedMember;
    }

    // TO REJECT TRAINER'S MEMBER ASSIGNMENT
    async rejectMemberAssignment(memberPublicId: string, gymId: number) {
        // PARAMETER CHECK

        AppError.assertGym(gymId);
        AppError.assertMemberPublicId(memberPublicId);

        logger.info(`Rejecting member assignment for member publicId: ${memberPublicId} in gymId: ${gymId}`);

        const member = await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                gymId: gymId,
            }
        });

        if (!member) {
            logger.warn(`Member assignment rejection failed: Member not found with publicId: ${memberPublicId} in gymId: ${gymId}`);
            throw new AppError(404, "Üye bu salonda bulunamadı.");
        }

        if (member.assignmentStatus !== 'PENDING') {
            logger.warn(`Member assignment rejection failed: Status is not PENDING (${member.assignmentStatus}) for publicId: ${memberPublicId}`);
            throw new AppError(400, "Sadece onay bekleyen (PENDING) talepler reddedilebilir.");
        }

        const updatedMember = await prisma.member.update({
            where: { id: member.id },
            data: {
                trainerId: null,
                assignmentStatus: 'UNASSIGNED',
            },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                assignmentStatus: true,
                trainerId: true
            }
        });

        logger.info(`Member assignment successfully rejected for publicId: ${memberPublicId}`);
        return updatedMember;
    }

    // GET MEMBERS BY ASSIGNMENT STATUS 
    async getMembersByStatus(gymId: number, status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED') {
        // PARAMETER CHECK

        AppError.assertGym(gymId);

        const validStatuses = ['PENDING', 'ASSIGNED', 'UNASSIGNED'];
        if (!status || !validStatuses.includes(status)) {
            throw new AppError(400, "Geçersiz atama durumu. (PENDING, ASSIGNED veya UNASSIGNED olmalıdır)");
        }

        logger.info(`Fetching members by status: ${status} for gymId: ${gymId}`);

        const members = await prisma.member.findMany({
            where: {
                gymId: gymId,
                assignmentStatus: status,
            },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                assignmentStatus: true,
                trainer: {
                    select: {
                        id: true,
                        publicId: true,
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