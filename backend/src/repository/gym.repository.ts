import prisma from "../lib/db";

//  GYM PROCESSES

export const gymRepo = {
    async findAllGyms() {
        return await prisma.gym.findMany({
            select: { id: true, name: true }
        });
    }
};

// MEMBER PROCESSES
export const memberListRepo = {
    async findPaginated(gymId: number, skip: number, limit: number) {
        return await Promise.all([
            prisma.member.findMany({
                where: { gymId },
                skip,
                take: limit,
                select: {
                    id: true,
                    publicId: true,
                    name: true,
                    surname: true,
                    avatarUrl: true,
                    email: true,
                    gymId: true,
                    assignmentStatus: true,
                    trainer: {
                        select: { name: true, surname: true }
                    }
                },
                orderBy: { id: 'desc' }
            }),
            prisma.member.count({ where: { gymId } })
        ]);
    },

    async findByStatus(gymId: number, status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED') {
        return await prisma.member.findMany({
            where: { gymId, assignmentStatus: status },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                assignmentStatus: true,
                trainer: {
                    select: { id: true, publicId: true, name: true, surname: true }
                }
            }
        });
    }
};
export const memberDetailRepo = {
    async findByPublicId(gymId: number, memberPublicId: string) {
        return await prisma.member.findFirst({
            where: { publicId: memberPublicId, gymId }
        });
    },

    // GET MEMBER'S DETAILED PROFILE DATAS 
    async findWithRelations(gymId: number, memberPublicId: string) {
        return await prisma.member.findFirst({
            where: { publicId: memberPublicId, gymId },
            select: {
                publicId: true,
                name: true,
                surname: true,
                email: true,
                age: true,
                height: true,
                weight: true,
                phone: true,
                gender: true,
                avatarUrl: true,
                assignmentStatus: true,
                isProfileCompleted: true,
                medicalNotes: true,
                createdAt: true,
                updatedAt: true,
                trainer: { select: { publicId: true, name: true, surname: true } },
                gym: { select: { publicId: true, name: true } },
            }
        });
    },

    // GET MEASUREMENT PAGINATED FOR MEMBER 
    async findMeasurementsPaginated(memberId: number, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma.memberMeasurement.findMany({
                where: { memberId },
                orderBy: { measuredAt: "desc" },
                skip,
                take: limit,
                select: {
                    publicId: true,
                    bodyFatRate: true,
                    muscleMass: true,
                    chest: true,
                    waist: true,
                    arm: true,
                    hip: true,
                    shoulder: true,
                    photos: true,
                    notes: true,
                    measuredAt: true,
                    createdAt: true,
                }
            }),
            prisma.memberMeasurement.count({ where: { memberId } })
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    // GET SESSIONS PAGINATED FOR MEMBER 
    async findSessionsPaginated(memberId: number, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma.session.findMany({
                where: { memberId },
                orderBy: { checkIn: "desc" },
                skip,
                take: limit,
                select: { checkIn: true, checkOut: true, duration: true }
            }),
            prisma.session.count({ where: { memberId } })
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    // GET PROGRAMS PAGINATED FOR MEMBER 
    async findProgramsPaginated(memberId: number, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma.program.findMany({
                where: { memberId },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
                select: { publicId: true, type: true, title: true, splitType: true, isActive: true, createdAt: true }
            }),
            prisma.program.count({ where: { memberId } })
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    async deleteWithRelations(memberId: number) {
        return prisma.$transaction(async (tx) => {
            await tx.session.deleteMany({ where: { memberId } });
            await tx.program.deleteMany({ where: { memberId } });
            return await tx.member.delete({ where: { id: memberId } });
        });
    },

    async updateAssignmentStatus(memberId: number, status: 'ASSIGNED' | 'UNASSIGNED', trainerIdNull: boolean = false) {
        return await prisma.member.update({
            where: { id: memberId },
            data: {
                assignmentStatus: status,
                ...(trainerIdNull && { trainerId: null })
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
    }
};

// TRAINER PROCESSES
export const trainerRepo = {
    async findAll(gymId: number) {
        return await prisma.trainer.findMany({
            where: { gymId },
            select: { id: true, publicId: true, name: true, surname: true, email: true, gymId: true }
        });
    },

    async findByPublicId(gymId: number, trainerPublicId: string) {
        return await prisma.trainer.findFirst({
            where: { publicId: trainerPublicId, gymId }
        });
    },

    async findDetailWithRelations(gymId: number, trainerPublicId: string) {
        return await prisma.trainer.findFirst({
            where: { publicId: trainerPublicId, gymId },
            select: {
                id: true,
                publicId: true,
                avatarUrl: true,
                name: true,
                surname: true,
                email: true,
                createdAt: true,
                myMembers: { select: { id: true, publicId: true, name: true, surname: true, email: true } },
                programs: {
                    orderBy: { createdAt: "desc" },
                    take: 20,
                    select: {
                        id: true,
                        title: true,
                        splitType: true,
                        isActive: true,
                        createdAt: true,
                        member: { select: { id: true, publicId: true, name: true, surname: true } }
                    }
                }
            }
        });
    },

    async deleteWithRelations(trainerId: number, gymId: number) {
        return prisma.$transaction(async (tx) => {
            await tx.member.updateMany({
                where: { gymId, trainerId },
                data: { assignmentStatus: 'UNASSIGNED', trainerId: null }
            });
            await tx.program.deleteMany({ where: { trainerId } });
            return await prisma.trainer.delete({ where: { id: trainerId } });
        });
    }
};