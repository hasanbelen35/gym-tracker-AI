import prisma from "../lib/db";
import { generateAIAnalysis } from './ai.client';
import { TRAINER_SYSTEM_PROMPT } from './trainer.prompts';

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

    const sanitizedDataForAI = {
        profile: {
            age: member.age,
            gender: member.gender,
            height: member.height,
            weight: member.weight,
            medicalNotes: member.medicalNotes || "Belirtilmemiş",
        },
        recentMeasurements: member.measurements.map(m => ({
            date: m.measuredAt.toISOString().split('T')[0],
            bodyFatRate: m.bodyFatRate,
            muscleMass: m.muscleMass,
            chest: m.chest,
            waist: m.waist,
            arm: m.arm,
        })),
        activePrograms: member.programs.map(p => ({
            title: p.title,
            splitType: p.splitType,
            days: p.days.map(d => ({
                dayName: d.dayName,
                isRestDay: d.isRestDay,
                exercises: d.exercises.map(e => ({
                    exerciseName: e.exercise.name,
                    notes: e.notes,
                    setsCount: e.sets.length,
                    targetReps: e.sets.map(s => s.targetReps),
                    targetWeights: e.sets.map(s => s.targetWeight),
                })),
            })),
        })),
    };

    const userContentString = JSON.stringify(sanitizedDataForAI, null, 2);

    const analysisResult = await generateAIAnalysis(TRAINER_SYSTEM_PROMPT, userContentString);

    return analysisResult;
};