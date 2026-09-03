import prisma from "../lib/db";
import { CompleteProfileInput } from '../types/types';

export class MemberService {
    // wıll delete 
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
            isProfileCompleted: true,
        };
        // update data in db
        await prisma.member.update({
            where: { id: memberId },
            data: updatedData,
        });
        return updatedData;
    }
// get current member profile data
    async getCurrentMember(memberId: number) {
        const member = await prisma.member.findUnique({
            where: { id: memberId },
            select: {
                name: true,
                surname: true,
                email: true,
                age: true,
                height: true,
                weight: true,
                phone: true,
                medicalNotes: true,
                gender: true,
                avatarUrl: true,
                assignmentStatus: true,
                isProfileCompleted: true,
                gym: {
                    select: {
                        name: true,
                    }
                },
                trainer: {
                    select: {
                        name: true,
                        surname: true,
                        email: true,
                    }
                },
                sessions: {
                    take: 5,
                    orderBy: {
                        checkIn: 'desc',
                    },
                    select: {
                        checkIn: true,
                        checkOut: true,
                    },
                }
            }
        });

        if (!member) {
            throw new Error("Member can not founded.");
        }

        return member;
    }
}