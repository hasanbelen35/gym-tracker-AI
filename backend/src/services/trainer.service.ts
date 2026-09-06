import prisma from "../lib/db";
import { CreateMeasurementType } from '../types/types';
import { logger } from "../config/logger";

export class TrainerService {
    // SEND ASSIGNMENT REQ TO GYM FOR MEMBER
    async requestMemberAssignment(memberPublicId: string, trainerId: number, gymPublicId: string) {
        logger.info(`Trainer ID ${trainerId} attempting to request assignment for member publicId: ${memberPublicId} in gym publicId: ${gymPublicId}`);
        const result = await prisma.member.updateMany({
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
        logger.info(`Assignment request successfully sent for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
        return result;
    }
    // CANCEL ASSIGNMENT REQ FROM GYM FOR MEMBER
    async cancelMyAssignmentRequest(memberPublicId: string, trainerId: number, gymPublicId: string) {
        logger.info(`Trainer ID ${trainerId} attempting to cancel assignment request for member publicId: ${memberPublicId} in gym publicId: ${gymPublicId}`);
        const result = await prisma.member.updateMany({
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
        logger.info(`Assignment request successfully cancelled for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
        return result;
    }
    // GET MEMBER'S ASSIGNMENT STATUS
    async getMembersByStatus(
        trainerId: number,
        gymPublicId: string,
        status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED'
    ) {
        logger.info(`Fetching members with status '${status}' for trainer ID: ${trainerId} in gym publicId: ${gymPublicId}`);
        const members = await prisma.member.findMany({
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
        logger.info(`Successfully fetched ${members.length} members with status '${status}' for trainer ID: ${trainerId}`);
        return members;
    }
    // GET MEMBER'S DETAILED DATA 
    async getMemberDetail(trainerId: number, memberPublicId: string) {
        logger.info(`Fetching detailed data for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
        const member = await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED'
            },
            select: {
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
                medicalNotes:true,
                gender:true,
                avatarUrl:true,
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

        if (!member) {
            logger.warn(`Member detail fetch failed: Member not found or not assigned with publicId: ${memberPublicId} for trainer ID: ${trainerId}`);
            throw new Error("Member not found or you do not have access to this member.");
        }

        logger.info(`Successfully fetched details for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
        return member;
    }
    // ADD MEASUREMENTS TO MEMBERS
    async addMemberMeasurement(
        trainerId: number,
        memberPublicId: string,
        dto: CreateMeasurementType
    ) {
        logger.info(`Trainer ID ${trainerId} attempting to add measurement for member publicId: ${memberPublicId}`);
        const member = await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED'
            },
            select: { id: true }
        });

        if (!member) {
            logger.warn(`Add measurement failed: Member not found or unauthorized for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
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

        const measurement = await prisma.memberMeasurement.create({
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

        logger.info(`Measurement successfully added with ID: ${measurement.id} for member ID: ${member.id}`);
        return measurement;
    }
    // GET MEASUREMENTS FROM MEMBERS
    async getMemberMeasurements(trainerId: number, memberPublicId: string) {
        logger.info(`Fetching measurements for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
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
            logger.warn(`Get measurements failed: Member not found or unauthorized for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            throw new Error("Member not found or you do not have access to this member's measurements.");
        }

        logger.info(`Successfully fetched ${member.measurements.length} measurements for member ID: ${member.id}`);
        return member.measurements;
    }
    // DELETE MEMBER'S MEASUREMENT BY PUBLIC ID
    async deleteMemberMeasurement(trainerId: number, memberPublicId: string, measurementPublicId: string) {
        logger.info(`Trainer ID ${trainerId} attempting to delete measurement publicId: ${measurementPublicId} for member publicId: ${memberPublicId}`);
        const member = await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED'
            },
            select: { id: true }
        });

        if (!member) {
            logger.warn(`Delete measurement failed: Member not found or unauthorized for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            throw new Error("Member not found or you do not have permission to modify this member's measurements.");
        }

        const measurement = await prisma.memberMeasurement.findFirst({
            where: {
                publicId: measurementPublicId,
                memberId: member.id
            }
        });

        if (!measurement) {
            logger.warn(`Delete measurement failed: Measurement record not found with publicId: ${measurementPublicId}`);
            throw new Error("Measurement record not found.");
        }

        const deletedMeasurement = await prisma.memberMeasurement.delete({
            where: {
                publicId: measurementPublicId
            }
        });

        logger.info(`Measurement successfully deleted with publicId: ${measurementPublicId}`);
        return deletedMeasurement;
    }
}