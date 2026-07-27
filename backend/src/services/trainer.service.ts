import prisma from "../lib/db";

export class TrainerService {

    async requestMemberAssignment(memberPublicId: string, trainerId: number, gymPublicId: string) {
        return await prisma.member.updateMany({
            where: {
                publicId: memberPublicId,
                gym: { publicId: gymPublicId },
                assignmentStatus: 'UNASSIGNED',
            },
            data: {
                trainerId: trainerId,
                assignmentStatus: 'PENDING',
            }
        });
    }

    // draw back pendıng or assıgned status
    async cancelMyAssignmentRequest(memberPublicId: string, trainerId: number, gymPublicId: string) {
        return await prisma.member.updateMany({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                gym: { publicId: gymPublicId },
                assignmentStatus: { in: ['PENDING', 'ASSIGNED'] },
            },
            data: {
                trainerId: null,
                assignmentStatus: 'UNASSIGNED',
            }
        });
    }

    // get all members ın exıst gym
    async getMembersByStatus(
        trainerId: number,
        gymPublicId: string,
        status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED'
    ) {
        return await prisma.member.findMany({
            where: {
                trainerId: status === 'UNASSIGNED' ? null : trainerId,
                gym: { publicId: gymPublicId },
                assignmentStatus: status
            },
            select: {
                publicId: true,
                name: true,
                surname: true,
                email: true,
                assignmentStatus: true
            }
        });
    }

    // get member's detailed data
    async getMemberDetail(trainerId: number, memberPublicId: string) {
        return await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED'
            },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                phone: true,
                createdAt: true,
                assignmentStatus: true,
                weight: true,
                height: true,
                age: true,

                gym: {
                    select: { name: true }
                },
                programs: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
                sessions: {
                    orderBy: { checkIn: 'desc' },
                    take: 10
                }
            }
        });
    }

}