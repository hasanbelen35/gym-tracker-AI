import * as prismaModule from "@prisma/client";
import { logger } from "../../src/config/logger";
import { ExerciseService } from "../../src/services/workout.service";

jest.mock("@prisma/client", () => {
  const client = {
    exercise: { findMany: jest.fn() },
    member: { findUnique: jest.fn() },
    program: {
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => client), __client: client };
});

jest.mock("../../src/config/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn() },
}));

const db = (prismaModule as any).__client as {
  exercise: { findMany: jest.Mock };
  member: { findUnique: jest.Mock };
  program: { create: jest.Mock; findFirst: jest.Mock; delete: jest.Mock };
};

describe("ExerciseService", () => {
  let service: ExerciseService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new ExerciseService();
  });

  // =====================================================================
  // getExercisesByQuery
  // =====================================================================
  describe("getExercisesByQuery", () => {
    it("should use an empty where clause when no filters are given", async () => {
      db.exercise.findMany.mockResolvedValue([]);

      await service.getExercisesByQuery({});

      expect(db.exercise.findMany).toHaveBeenCalledWith({
        where: {},
        take: 50,
        orderBy: { name: "asc" },
      });
    });

    it("should apply all filters together", async () => {
      db.exercise.findMany.mockResolvedValue([]);

      await service.getExercisesByQuery({
        category: "strength",
        equipment: "barbell",
        targetMuscle: "chest",
      });

      expect(db.exercise.findMany).toHaveBeenCalledWith({
        where: {
          category: "strength",
          equipment: "barbell",
          targetMuscle: "chest",
        },
        take: 50,
        orderBy: { name: "asc" },
      });
    });

    it.each([
      ["category", "cardio"],
      ["equipment", "dumbbell"],
      ["targetMuscle", "back"],
    ])("should apply only the %s filter", async (key, value) => {
      db.exercise.findMany.mockResolvedValue([]);

      await service.getExercisesByQuery({ [key]: value });

      const arg = db.exercise.findMany.mock.calls[0][0];
      expect(arg.where).toEqual({ [key]: value });
    });

    it("should ignore empty strings", async () => {
      db.exercise.findMany.mockResolvedValue([]);

      await service.getExercisesByQuery({
        category: "",
        equipment: "",
        targetMuscle: "",
      });

      const arg = db.exercise.findMany.mock.calls[0][0];
      expect(arg.where).toEqual({});
    });

    it("should ignore non-string values", async () => {
      db.exercise.findMany.mockResolvedValue([]);

      await service.getExercisesByQuery({
        category: { $ne: null },
        equipment: 123,
        targetMuscle: ["chest"],
      } as any);

      const arg = db.exercise.findMany.mock.calls[0][0];
      expect(arg.where).toEqual({});
    });

    it("should return the exercises and log the count", async () => {
      const exercises = [{ name: "Bench Press" }, { name: "Squat" }];
      db.exercise.findMany.mockResolvedValue(exercises);

      const result = await service.getExercisesByQuery({});

      expect(result).toEqual(exercises);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("2 exercises")
      );
    });

    it("should propagate database errors", async () => {
      db.exercise.findMany.mockRejectedValue(new Error("db down"));

      await expect(service.getExercisesByQuery({})).rejects.toThrow("db down");
    });
  });

  // =====================================================================
  // createWorkoutProgram
  // =====================================================================
  describe("createWorkoutProgram", () => {
    const days = [
      {
        dayName: "Push",
        dayOrder: "1",
        isRestDay: false,
        exercises: [
          {
            exercisePublicId: "ex-1",
            orderIndex: 0,
            notes: "Warm up",
            sets: [
              { setNumber: 1, targetReps: "10", targetWeight: "60", rir: 2 },
              { setNumber: 2, targetReps: "8", targetWeight: "65", rir: 1 },
            ],
          },
          { exercisePublicId: "ex-2", sets: [{}] },
        ],
      },
      { dayName: "Rest", dayOrder: 2, isRestDay: true },
    ];

    const programData = {
      trainerId: 5,
      memberPublicId: "m-1",
      title: "Push Pull",
      days,
    };

    const setupHappyPath = () => {
      db.member.findUnique.mockResolvedValue({ id: 10, trainerId: 5 });
      db.exercise.findMany.mockResolvedValue([
        { id: 100, publicId: "ex-1" },
        { id: 101, publicId: "ex-2" },
      ]);
      db.program.create.mockResolvedValue({ id: 1 });
    };

    it("should look up the member and the exercises by public id", async () => {
      setupHappyPath();

      await service.createWorkoutProgram(programData);

      expect(db.member.findUnique).toHaveBeenCalledWith({
        where: { publicId: "m-1" },
      });
      expect(db.exercise.findMany).toHaveBeenCalledWith({
        where: { publicId: { in: ["ex-1", "ex-2"] } },
        select: { id: true, publicId: true },
      });
    });

    it("should create the program with the mapped days, exercises and sets", async () => {
      setupHappyPath();

      const result = await service.createWorkoutProgram(programData);

      expect(db.program.create).toHaveBeenCalledWith({
        data: {
          memberId: 10,
          trainerId: 5,
          title: "Push Pull",
          type: "WORKOUT",
          splitType: "PPL",
          isActive: true,
          days: {
            create: [
              {
                dayName: "Push",
                dayOrder: 1,
                isRestDay: false,
                exercises: {
                  create: [
                    {
                      exerciseId: 100,
                      orderIndex: 0,
                      notes: "Warm up",
                      sets: {
                        create: [
                          {
                            setNumber: 1,
                            targetReps: "10",
                            targetWeight: 60,
                            rir: 2,
                          },
                          {
                            setNumber: 2,
                            targetReps: "8",
                            targetWeight: 65,
                            rir: 1,
                          },
                        ],
                      },
                    },
                    {
                      exerciseId: 101,
                      orderIndex: 1,
                      notes: null,
                      sets: {
                        create: [
                          {
                            setNumber: 1,
                            targetReps: null,
                            targetWeight: null,
                            rir: null,
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                dayName: "Rest",
                dayOrder: 2,
                isRestDay: true,
                exercises: undefined,
              },
            ],
          },
        },
        include: {
          days: {
            include: {
              exercises: { include: { exercise: true, sets: true } },
            },
          },
          trainer: { select: { name: true, surname: true } },
        },
      });
      expect(result).toEqual({ id: 1 });
    });

    it("should use the provided type and splitType", async () => {
      setupHappyPath();

      await service.createWorkoutProgram({
        ...programData,
        type: "DIET",
        splitType: "FULL_BODY",
      });

      const arg = db.program.create.mock.calls[0][0];
      expect(arg.data.type).toBe("DIET");
      expect(arg.data.splitType).toBe("FULL_BODY");
    });

    it("should not create exercises for a rest day even if some are sent", async () => {
      setupHappyPath();

      await service.createWorkoutProgram({
        ...programData,
        days: [
          {
            dayName: "Rest",
            dayOrder: 1,
            isRestDay: true,
            exercises: [{ exercisePublicId: "ex-1" }],
          },
        ],
      });

      const arg = db.program.create.mock.calls[0][0];
      expect(arg.data.days.create[0].exercises).toBeUndefined();
    });

    it("should keep rir 0 instead of converting it to null", async () => {
      setupHappyPath();

      await service.createWorkoutProgram({
        ...programData,
        days: [
          {
            dayName: "Push",
            dayOrder: 1,
            exercises: [{ exercisePublicId: "ex-1", sets: [{ rir: 0 }] }],
          },
        ],
      });

      const arg = db.program.create.mock.calls[0][0];
      const set =
        arg.data.days.create[0].exercises.create[0].sets.create[0];
      expect(set.rir).toBe(0);
    });

    it("should convert a falsy targetWeight to null", async () => {
      setupHappyPath();

      await service.createWorkoutProgram({
        ...programData,
        days: [
          {
            dayName: "Push",
            dayOrder: 1,
            exercises: [
              { exercisePublicId: "ex-1", sets: [{ targetWeight: 0 }] },
            ],
          },
        ],
      });

      const arg = db.program.create.mock.calls[0][0];
      const set =
        arg.data.days.create[0].exercises.create[0].sets.create[0];
      expect(set.targetWeight).toBeNull();
    });

    it("should handle days that have no exercises", async () => {
      db.member.findUnique.mockResolvedValue({ id: 10, trainerId: 5 });
      db.exercise.findMany.mockResolvedValue([]);
      db.program.create.mockResolvedValue({ id: 1 });

      await service.createWorkoutProgram({
        ...programData,
        days: [{ dayName: "Free", dayOrder: 1, isRestDay: false }],
      });

      expect(db.exercise.findMany).toHaveBeenCalledWith({
        where: { publicId: { in: [] } },
        select: { id: true, publicId: true },
      });
      const arg = db.program.create.mock.calls[0][0];
      expect(arg.data.days.create[0].exercises.create).toEqual([]);
    });

    it("should throw if the member does not exist", async () => {
      db.member.findUnique.mockResolvedValue(null);

      await expect(service.createWorkoutProgram(programData)).rejects.toThrow(
        "Üye bulunamadı."
      );
      expect(db.exercise.findMany).not.toHaveBeenCalled();
      expect(db.program.create).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("m-1"));
    });

    it("should throw if the member belongs to another trainer", async () => {
      db.member.findUnique.mockResolvedValue({ id: 10, trainerId: 99 });

      await expect(service.createWorkoutProgram(programData)).rejects.toThrow(
        "Bu üyeye program oluşturma yetkiniz yok."
      );
      expect(db.exercise.findMany).not.toHaveBeenCalled();
      expect(db.program.create).not.toHaveBeenCalled();
    });

    it("should throw if the member has no trainer assigned", async () => {
      db.member.findUnique.mockResolvedValue({ id: 10, trainerId: null });

      await expect(service.createWorkoutProgram(programData)).rejects.toThrow(
        "Bu üyeye program oluşturma yetkiniz yok."
      );
      expect(db.program.create).not.toHaveBeenCalled();
    });

    it("should throw if an exercise does not exist", async () => {
      db.member.findUnique.mockResolvedValue({ id: 10, trainerId: 5 });
      db.exercise.findMany.mockResolvedValue([{ id: 100, publicId: "ex-1" }]);

      await expect(service.createWorkoutProgram(programData)).rejects.toThrow(
        "Egzersiz bulunamadı: ex-2"
      );
      expect(db.program.create).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("ex-2"));
    });

    it("should propagate database errors from create", async () => {
      setupHappyPath();
      db.program.create.mockRejectedValue(new Error("db down"));

      await expect(service.createWorkoutProgram(programData)).rejects.toThrow(
        "db down"
      );
    });
  });

  // =====================================================================
  // deleteWorkoutProgram
  // =====================================================================
  describe("deleteWorkoutProgram", () => {
    it("should delete the program owned by the trainer", async () => {
      db.program.findFirst.mockResolvedValue({ id: 7 });
      db.program.delete.mockResolvedValue({});

      const result = await service.deleteWorkoutProgram("p-1", 5);

      expect(db.program.findFirst).toHaveBeenCalledWith({
        where: { publicId: "p-1", trainerId: 5 },
      });
      expect(db.program.delete).toHaveBeenCalledWith({ where: { id: 7 } });
      expect(result).toEqual({
        success: true,
        message:
          "The program and all associated content have been successfully deleted.",
      });
    });

    it("should throw and not delete if the program is not found or unauthorized", async () => {
      db.program.findFirst.mockResolvedValue(null);

      await expect(service.deleteWorkoutProgram("p-1", 5)).rejects.toThrow(
        "The program was either not found or you do not have permission to perform this operation."
      );
      expect(db.program.delete).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("p-1"));
    });

    it("should propagate database errors from delete", async () => {
      db.program.findFirst.mockResolvedValue({ id: 7 });
      db.program.delete.mockRejectedValue(new Error("db down"));

      await expect(service.deleteWorkoutProgram("p-1", 5)).rejects.toThrow(
        "db down"
      );
    });
  });

  // =====================================================================
  // getProgramDetail
  // =====================================================================
  describe("getProgramDetail", () => {
    it("should query by publicId and trainerId with ordered relations", async () => {
      db.program.findFirst.mockResolvedValue({ id: 1 });

      await service.getProgramDetail("p-1", 5);

      expect(db.program.findFirst).toHaveBeenCalledWith({
        where: { publicId: "p-1", trainerId: 5 },
        include: {
          days: {
            orderBy: { dayOrder: "asc" },
            include: {
              exercises: {
                orderBy: { orderIndex: "asc" },
                include: {
                  exercise: true,
                  sets: { orderBy: { setNumber: "asc" } },
                },
              },
            },
          },
          member: {
            select: {
              publicId: true,
              name: true,
              surname: true,
              email: true,
            },
          },
        },
      });
    });

    it("should return the program wrapped in a success response", async () => {
      const program = { id: 1, title: "Push Pull" };
      db.program.findFirst.mockResolvedValue(program);

      const result = await service.getProgramDetail("p-1", 5);

      expect(result).toEqual({ success: true, data: program });
    });

    it("should not expose the member password", async () => {
      db.program.findFirst.mockResolvedValue({ id: 1 });

      await service.getProgramDetail("p-1", 5);

      const arg = db.program.findFirst.mock.calls[0][0];
      expect(arg.include.member.select).not.toHaveProperty("password");
    });

    it("should throw if the program is not found or unauthorized", async () => {
      db.program.findFirst.mockResolvedValue(null);

      await expect(service.getProgramDetail("p-1", 5)).rejects.toThrow(
        "Program was either not found or you do not have permission to view this program."
      );
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("p-1"));
    });
  });
});