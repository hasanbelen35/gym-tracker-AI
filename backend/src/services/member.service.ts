import prisma from "../lib/db";
import { CompleteProfileInput } from '../types/types';

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

        return {
            trainer: member.trainer,
            assignmentStatus: member.assignmentStatus,
        };
    }

    // UPDATE MEMBER PROFILE DATAS
    async updateMemberProfile(memberId: number, data: CompleteProfileInput) {
        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
        });

        if (!existingMember) {
            throw new Error("Üye bulunamadı.");
        }
        // datas
        const updatedData = {
            ...(data.age !== undefined && { age: data.age }),
            ...(data.height !== undefined && { height: data.height }),
            ...(data.weight !== undefined && { weight: data.weight }),
            ...(data.gender !== undefined && { gender: data.gender }),
            ...(data.medicalNotes !== undefined && { medicalNotes: data.medicalNotes }),
            ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        };
        // update data in db
        await prisma.member.update({
            where: { id: memberId },
            data: updatedData,
        });

      
        return updatedData;
    }
}