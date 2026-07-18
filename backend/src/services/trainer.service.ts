import prisma from "../lib/db";

export class TrainerService {

    // ASSIGN MEMBER REQUEST
    async requestMemberAssignment(memberPublicId: string, trainerId: number, gymId: number) {
        return await prisma.member.updateMany({
            where: {
                publicId: memberPublicId,
                gymId: gymId,
                assignmentStatus: 'UNASSIGNED', // JUST NON ASSIGNED MEMBERS
            },
            data: {
                trainerId: trainerId,
                assignmentStatus: 'PENDING',
            }
        });
    }

    // DRAW BACK TO ASSİGN REQUEST
    async cancelMyAssignmentRequest(memberPublicId: string, trainerId: number, gymId: number) {
        return await prisma.member.updateMany({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                gymId: gymId,
                assignmentStatus: 'PENDING',
            },
            data: {
                trainerId: null,
                assignmentStatus: 'UNASSIGNED',
            }
        });
    }

    // FETCH MEMBERS AS ASSIGNMENT STATUS
    async getMembersByStatus(trainerId: number, gymId: number, status: 'PENDING' | 'ASSIGNED') {
        return await prisma.member.findMany({
            where: {
                trainerId,
                gymId,
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
