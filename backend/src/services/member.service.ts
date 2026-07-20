import prisma from "../lib/db";


export class MemberService {
    async getAssignedTrainerForMember(memberId: number) {
        const member = await prisma.member.findUnique({
            where: { id: memberId },
            include: {
                trainer: {
                    select: {
                        name: true,
                        surname: true,
                        email: true,
                    }
                }
            }
        });

        if (!member) {
            throw new Error("Üye kaydı bulunamadı.");
        }
        // return assignment status also
        return {
            trainer: member.trainer,
            assignmentStatus: member.assignmentStatus,
        };
    }
};
