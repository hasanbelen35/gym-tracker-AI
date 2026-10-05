import prisma from "../lib/db";
import { generateAIAnalysis } from './ai.client';
import { TRAINER_ANALYZE_MEMBER_PROFILE_PROMPT } from './trainer.prompts';
import { aiAnalysisPayloadSchema } from "../validations/ai/trainer.ai.validations";

export const analyzeMemberPerformanceService = async (memberPublicId: string): Promise<string> => {
    const member = await prisma.member.findUnique({
        where: { publicId: memberPublicId },
        include: {
            measurements: {
                orderBy: { measuredAt: 'desc' },
                take: 5,
            },
            programs: {
                where: { isActive: true },
                include: {
                    days: {
                        include: {
                            exercises: {
                                include: {
                                    exercise: true,
                                    sets: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!member) {
        throw new Error("Analiz edilecek üye bulunamadı.");
    }

    const rawDataForAI = {
        profile: {
            age: member.age || "Belirtilmemiş",
            gender: member.gender || "Belirtilmemiş",
            height: member.height ? `${member.height} cm` : "Belirtilmemiş",
            weight: member.weight ? `${member.weight} kg` : "Belirtilmemiş",
            medicalNotes: member.medicalNotes && member.medicalNotes.length > 2 ? member.medicalNotes : "Not girilmemiş",
        },
        hasMeasurements: member.measurements.length > 0,
        recentMeasurements: member.measurements.map(m => ({
            date: m.measuredAt.toISOString().split('T')[0],
            bodyFatRate: m.bodyFatRate ?? 0,
            muscleMass: m.muscleMass ?? 0,
            chest: m.chest ?? 0,
            waist: m.waist ?? 0,
            arm: m.arm ?? 0,
        })),
        activePrograms: member.programs.map(p => ({
            title: p.title,
            splitType: p.splitType,
            days: p.days.map(d => ({
                dayName: d.dayName,
                isRestDay: d.isRestDay,
                exercises: d.exercises.map(e => ({
                    name: e.exercise.name,
                    notes: e.notes || "",
                    sets: e.sets.map(s => ({ r: s.targetReps, w: s.targetWeight })),
                })),
            })),
        })),
    };

    const validationResult = aiAnalysisPayloadSchema.safeParse(rawDataForAI);

    const dataToUse = validationResult.success ? validationResult.data : rawDataForAI;

    const userContentString = JSON.stringify(dataToUse);

    const analysisResult = await generateAIAnalysis(TRAINER_ANALYZE_MEMBER_PROFILE_PROMPT, userContentString);

    return analysisResult;
};