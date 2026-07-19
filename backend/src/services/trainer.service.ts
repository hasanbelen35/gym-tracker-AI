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

    async cancelMyAssignmentRequest(memberPublicId: string, trainerId: number, gymPublicId: string) {
        return await prisma.member.updateMany({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                gym: { publicId: gymPublicId },
                assignmentStatus: 'PENDING',
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

}