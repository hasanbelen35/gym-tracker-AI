import prisma from "../lib/db";
import { CreateMeasurementType } from '../types/types';

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
                assignmentStatus: { in: ['PENDING', 'ASSIGNED'] },
            },
            data: {
                trainerId: null,
                assignmentStatus: 'UNASSIGNED',
            }
        });
    }

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

    async addMemberMeasurement(
        trainerId: number, 
        memberPublicId: string, 
        dto: CreateMeasurementType
    ) {
        const member = await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED'
            },
            select: { id: true }
        });

        if (!member) {
            throw new Error("Member not found or you do not have permission to add measurements for this member.");
        }

        const { 
            bodyFatRate, 
            muscleMass, 
            chest, 
            waist, 
            arm, 
            hip, 
            shoulder, 
            photos, 
            notes 
        } = dto;

        return await prisma.memberMeasurement.create({
            data: {
                memberId: member.id,
                bodyFatRate,
                muscleMass,
                chest,
                waist,
                arm,
                hip,
                shoulder,
                photos: photos || [],
                notes,
            }
        });
    }

    async getMemberMeasurements(trainerId: number, memberPublicId: string) {
        const member = await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED'
            },
            select: {
                id: true,
                measurements: {
                    orderBy: { measuredAt: 'desc' }
                }
            }
        });

        if (!member) {
            throw new Error("Member not found or you do not have access to this member's measurements.");
        }

        return member.measurements;
    }

}