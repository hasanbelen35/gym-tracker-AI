import { DietService } from "../../src/services/nutrition.service";
import { PrismaClient } from "@prisma/client";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    member: {
      findUnique: jest.fn(),
    },
    dietProgram: {
      create: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
    MealType: {
      BREAKFAST: "BREAKFAST",
      LUNCH: "LUNCH",
      DINNER: "DINNER",
      SNACK: "SNACK",
      PRE_WORKOUT: "PRE_WORKOUT",
      POST_WORKOUT: "POST_WORKOUT",
    },
  };
});

// CREATE DIET PROGRAM UNIT TEST
describe("DietService - createDietProgram Unit Tests", () => {
  let dietService: DietService;
  let prismaMock: any;

  beforeEach(() => {
    dietService = new DietService();
    prismaMock = new (PrismaClient as any)();
    jest.clearAllMocks();
  });

  it("should successfully create a diet program when member exists and belongs to the trainer", async () => {
    const mockTrainerId = 1;
    const mockMemberPublicId = "member-uuid-123";
    const mockMember = {
      id: 10,
      publicId: mockMemberPublicId,
      trainerId: mockTrainerId,
    };

    const payload = {
      trainerId: mockTrainerId,
      memberPublicId: mockMemberPublicId,
      title: "Haftalık Yağ Yakım Programı",
      days: [
        {
          dayName: "Pazartesi",
          dayOrder: 1,
          meals: [
            {
              mealType: "BREAKFAST",
              mealTitle: "Sabah Öğünü",
              orderIndex: 0,
              items: [
                {
                  foodName: "Yulaf Ezmesi",
                  amount: 50,
                  unit: "gram",
                  calories: 180,
                  protein: 6,
                  carbs: 30,
                  fat: 3,
                },
              ],
            },
          ],
        },
      ],
    };

    const mockCreatedProgram = {
      id: 1,
      memberId: mockMember.id,
      trainerId: mockTrainerId,
      title: payload.title,
      isActive: true,
    };

    prismaMock.member.findUnique.mockResolvedValue(mockMember);
    prismaMock.dietProgram.create.mockResolvedValue(mockCreatedProgram);

    const result = await dietService.createDietProgram(payload);

    expect(prismaMock.member.findUnique).toHaveBeenCalledWith({
      where: { publicId: mockMemberPublicId },
    });
    expect(prismaMock.dietProgram.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockCreatedProgram);
  });

  it("should throw an error when member is not found in the database", async () => {
    prismaMock.member.findUnique.mockResolvedValue(null);

    const payload = {
      trainerId: 1,
      memberPublicId: "non-existent-member",
      title: "Test Program",
      days: [],
    };

    await expect(dietService.createDietProgram(payload)).rejects.toThrow("Member not found.");
    expect(prismaMock.dietProgram.create).not.toHaveBeenCalled();
  });

  it("should throw an error when the member belongs to a different trainer", async () => {
    prismaMock.member.findUnique.mockResolvedValue({
      id: 10,
      publicId: "member-uuid-123",
      trainerId: 99, 
    });

    const payload = {
      trainerId: 1, 
      memberPublicId: "member-uuid-123",
      title: "Test Program",
      days: [],
    };

    await expect(dietService.createDietProgram(payload)).rejects.toThrow(
      "You do not have permission to create a diet program for this member."
    );
    expect(prismaMock.dietProgram.create).not.toHaveBeenCalled();
  });
});