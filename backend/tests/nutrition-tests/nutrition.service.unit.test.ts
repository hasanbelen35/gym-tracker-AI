import { MealType, PrismaClient } from "@prisma/client";
import { DietService } from "../../src/services/nutrition.service";
import { CreateDietProgramInput } from "../../src/types/nutrition.types";

// ---- Mock the logger so tests don't produce console noise and we can assert on calls ----
jest.mock("../../src/config/logger", () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    },
}));

// ---- Mock PrismaClient entirely.
// IMPORTANT: the mock jest.fn()s are created INSIDE the factory, not as outer
// consts referenced from it — jest hoists jest.mock() calls above all other
// statements in the file, so any outer const the factory closes over would
// still be in its temporal-dead-zone the first time the factory runs
// (which happens as soon as the service file does `new PrismaClient()` at
// import time). Defining them inside the factory avoids that entirely.
jest.mock("@prisma/client", () => {
    const actual = jest.requireActual("@prisma/client");
    return {
        ...actual,
        PrismaClient: jest.fn().mockImplementation(() => ({
            member: {
                findUnique: jest.fn(),
            },
            dietProgram: {
                create: jest.fn(),
                findFirst: jest.fn(),
                findMany: jest.fn(),
                delete: jest.fn(),
            },
        })),
    };
});

// The service module calls `new PrismaClient()` exactly once at import time.
// Grab that single mocked instance's methods here so tests can configure them.
const mockPrismaInstance = (PrismaClient as unknown as jest.Mock).mock.results[0]
    .value as {
    member: { findUnique: jest.Mock };
    dietProgram: {
        create: jest.Mock;
        findFirst: jest.Mock;
        findMany: jest.Mock;
        delete: jest.Mock;
    };
};

const mockMemberFindUnique = mockPrismaInstance.member.findUnique;
const mockDietProgramCreate = mockPrismaInstance.dietProgram.create;
const mockDietProgramFindFirst = mockPrismaInstance.dietProgram.findFirst;
const mockDietProgramFindMany = mockPrismaInstance.dietProgram.findMany;
const mockDietProgramDelete = mockPrismaInstance.dietProgram.delete;

describe("DietService", () => {
    let dietService: DietService;

    beforeEach(() => {
        jest.clearAllMocks();
        dietService = new DietService();
    });

    // ============================================================
    // createDietProgram
    // ============================================================
    describe("createDietProgram", () => {
        const basePayload: CreateDietProgramInput = {
            trainerId: 1,
            memberPublicId: "member-public-id-123",
            title: "Kesim Diyeti",
            days: [
                {
                    dayName: "Pazartesi",
                    dayOrder: 1,
                    meals: [
                        {
                            mealType: MealType.BREAKFAST,
                            mealTitle: "Kahvaltı",
                            orderIndex: 0,
                            items: [
                                {
                                    foodName: "Yumurta",
                                    amount: 2,
                                    unit: "adet",
                                    calories: 140,
                                    protein: 12,
                                    carbs: 1,
                                    fat: 10,
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        const fakeMember = {
            id: 5,
            publicId: "member-public-id-123",
            trainerId: 1,
        };

        it("should create a diet program when member exists and trainer is authorized", async () => {
            mockMemberFindUnique.mockResolvedValue(fakeMember);
            const fakeCreatedProgram = { id: 10, ...basePayload };
            mockDietProgramCreate.mockResolvedValue(fakeCreatedProgram);

            const result = await dietService.createDietProgram(basePayload);

            expect(mockMemberFindUnique).toHaveBeenCalledWith({
                where: { publicId: basePayload.memberPublicId },
            });

            expect(mockDietProgramCreate).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        memberPublicId: fakeMember.publicId,
                        trainerId: basePayload.trainerId,
                        title: basePayload.title,
                        isActive: true,
                    }),
                })
            );

            expect(result).toEqual(fakeCreatedProgram);
        });

        it("should throw an error if the member does not exist", async () => {
            mockMemberFindUnique.mockResolvedValue(null);

            await expect(dietService.createDietProgram(basePayload)).rejects.toThrow(
                "Member not found."
            );

            expect(mockDietProgramCreate).not.toHaveBeenCalled();
        });

        it("should throw an error if the trainer does not own the member", async () => {
            mockMemberFindUnique.mockResolvedValue({
                ...fakeMember,
                trainerId: 999, // different trainer
            });

            await expect(dietService.createDietProgram(basePayload)).rejects.toThrow(
                "You do not have permission to create a diet program for this member."
            );

            expect(mockDietProgramCreate).not.toHaveBeenCalled();
        });

        it("should correctly map nested days, meals, and items into the create payload", async () => {
            mockMemberFindUnique.mockResolvedValue(fakeMember);
            mockDietProgramCreate.mockResolvedValue({ id: 10 });

            await dietService.createDietProgram(basePayload);

            const callArg = mockDietProgramCreate.mock.calls[0][0];
            const createdDay = callArg.data.days.create[0];
            const createdMeal = createdDay.meals.create[0];
            const createdItem = createdMeal.items.create[0];

            expect(createdDay.dayName).toBe("Pazartesi");
            expect(createdDay.dayOrder).toBe(1);
            expect(createdMeal.mealType).toBe(MealType.BREAKFAST);
            expect(createdMeal.orderIndex).toBe(0);
            expect(createdItem.foodName).toBe("Yumurta");
            expect(createdItem.amount).toBe(2);
            expect(createdItem.calories).toBe(140);
        });

        it("should default missing optional item fields (calories/protein/etc.) to null", async () => {
            mockMemberFindUnique.mockResolvedValue(fakeMember);
            mockDietProgramCreate.mockResolvedValue({ id: 10 });

            const payloadWithMissingFields: CreateDietProgramInput = {
                ...basePayload,
                days: [
                    {
                        dayName: "Salı",
                        dayOrder: 2,
                        meals: [
                            {
                                mealType: MealType.LUNCH,
                                items: [
                                    {
                                        foodName: "Tavuk",
                                        amount: 150,
                                        unit: "gram",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };

            await dietService.createDietProgram(payloadWithMissingFields);

            const callArg = mockDietProgramCreate.mock.calls[0][0];
            const createdItem = callArg.data.days.create[0].meals.create[0].items.create[0];

            expect(createdItem.calories).toBeNull();
            expect(createdItem.protein).toBeNull();
            expect(createdItem.carbs).toBeNull();
            expect(createdItem.fat).toBeNull();
            expect(createdItem.notes).toBeNull();
        });
    });

    // ============================================================
    // deleteDietProgram
    // ============================================================
    describe("deleteDietProgram", () => {
        const programPublicId = "program-public-id-abc";
        const trainerId = 1;

        it("should delete the diet program when found and owned by the trainer", async () => {
            const fakeProgram = { id: 42, publicId: programPublicId, trainerId };
            mockDietProgramFindFirst.mockResolvedValue(fakeProgram);
            mockDietProgramDelete.mockResolvedValue(fakeProgram);

            const result = await dietService.deleteDietProgram(programPublicId, trainerId);

            expect(mockDietProgramFindFirst).toHaveBeenCalledWith({
                where: { publicId: programPublicId, trainerId },
            });
            expect(mockDietProgramDelete).toHaveBeenCalledWith({
                where: { id: fakeProgram.id },
            });
            expect(result).toEqual({
                success: true,
                message:
                    "The diet program and all associated content have been successfully deleted.",
            });
        });

        it("should throw an error if the program is not found or not owned by the trainer", async () => {
            mockDietProgramFindFirst.mockResolvedValue(null);

            await expect(
                dietService.deleteDietProgram(programPublicId, trainerId)
            ).rejects.toThrow(
                "The diet program was either not found or you do not have permission to perform this operation."
            );

            expect(mockDietProgramDelete).not.toHaveBeenCalled();
        });
    });

    // ============================================================
    // getDietProgramDetail
    // ============================================================
    describe("getDietProgramDetail", () => {
        const programPublicId = "program-public-id-xyz";
        const trainerId = 1;

        it("should return the program detail wrapped in a success envelope", async () => {
            const fakeProgram = {
                id: 7,
                publicId: programPublicId,
                trainerId,
                days: [],
                member: {
                    publicId: "member-public-id-123",
                    name: "Ali",
                    surname: "Veli",
                    email: "ali@example.com",
                },
            };
            mockDietProgramFindFirst.mockResolvedValue(fakeProgram);

            const result = await dietService.getDietProgramDetail(programPublicId, trainerId);

            expect(mockDietProgramFindFirst).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { publicId: programPublicId, trainerId },
                })
            );
            expect(result).toEqual({ success: true, data: fakeProgram });
        });

        it("should throw an error if the program is not found or not owned by the trainer", async () => {
            mockDietProgramFindFirst.mockResolvedValue(null);

            await expect(
                dietService.getDietProgramDetail(programPublicId, trainerId)
            ).rejects.toThrow(
                "Diet program was either not found or you do not have permission to view this program."
            );
        });
    });

    // ============================================================
    // getMemberDietPrograms
    // ============================================================
    describe("getMemberDietPrograms", () => {
        const memberPublicId = "member-public-id-123";
        const trainerId = 1;
        const fakeMember = { id: 5, publicId: memberPublicId, trainerId };

        it("should return the list of diet programs for an authorized trainer/member pair", async () => {
            mockMemberFindUnique.mockResolvedValue(fakeMember);
            const fakePrograms = [
                { id: 1, memberPublicId, title: "Program A" },
                { id: 2, memberPublicId, title: "Program B" },
            ];
            mockDietProgramFindMany.mockResolvedValue(fakePrograms);

            const result = await dietService.getMemberDietPrograms(memberPublicId, trainerId);

            expect(mockMemberFindUnique).toHaveBeenCalledWith({
                where: { publicId: memberPublicId },
            });
            expect(mockDietProgramFindMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { memberPublicId: fakeMember.publicId },
                })
            );
            expect(result).toEqual(fakePrograms);
        });

        it("should throw an error if the member does not exist", async () => {
            mockMemberFindUnique.mockResolvedValue(null);

            await expect(
                dietService.getMemberDietPrograms(memberPublicId, trainerId)
            ).rejects.toThrow(
                "Member not found or you do not have permission to access this member."
            );

            expect(mockDietProgramFindMany).not.toHaveBeenCalled();
        });

        it("should throw an error if the member belongs to a different trainer", async () => {
            mockMemberFindUnique.mockResolvedValue({ ...fakeMember, trainerId: 999 });

            await expect(
                dietService.getMemberDietPrograms(memberPublicId, trainerId)
            ).rejects.toThrow(
                "Member not found or you do not have permission to access this member."
            );

            expect(mockDietProgramFindMany).not.toHaveBeenCalled();
        });
    });
});