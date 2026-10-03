import prisma from "../../src/lib/db";
import { logger } from "../../src/config/logger";
import { MemberService } from "../../src/services/member.service";

jest.mock("../../src/lib/db", () => ({
  __esModule: true,
  default: {
    member: { findUnique: jest.fn(), update: jest.fn() },
    program: { findMany: jest.fn() },
  },
}));

jest.mock("../../src/config/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn() },
}));

const db = prisma as unknown as {
  member: { findUnique: jest.Mock; update: jest.Mock };
  program: { findMany: jest.Mock };
};

describe("MemberService", () => {
  let service: MemberService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new MemberService();
  });

  // =====================================================================
  // getAssignedTrainerForMember
  // =====================================================================
  describe("getAssignedTrainerForMember", () => {
    it("should return only trainer and assignmentStatus", async () => {
      db.member.findUnique.mockResolvedValue({
        assignmentStatus: "ASSIGNED",
        trainer: { name: "Jane", surname: "Smith", email: "jane@test.com" },
      });

      const result = await service.getAssignedTrainerForMember(1);

      expect(db.member.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          assignmentStatus: true,
          trainer: { select: { name: true, surname: true, email: true } },
        },
      });
      expect(result).toEqual({
        trainer: { name: "Jane", surname: "Smith", email: "jane@test.com" },
        assignmentStatus: "ASSIGNED",
      });
      expect(result).not.toHaveProperty("password");
    });

    it("should not fetch the password from the database", async () => {
      db.member.findUnique.mockResolvedValue({
        assignmentStatus: "ASSIGNED",
        trainer: null,
      });

      await service.getAssignedTrainerForMember(1);

      const arg = db.member.findUnique.mock.calls[0][0];
      expect(arg).not.toHaveProperty("include");
      expect(arg.select).not.toHaveProperty("password");
    });

    it("should return a null trainer when none is assigned", async () => {
      db.member.findUnique.mockResolvedValue({
        assignmentStatus: "UNASSIGNED",
        trainer: null,
      });

      const result = await service.getAssignedTrainerForMember(1);

      expect(result).toEqual({ trainer: null, assignmentStatus: "UNASSIGNED" });
    });

    it("should throw if the member does not exist", async () => {
      db.member.findUnique.mockResolvedValue(null);

      await expect(service.getAssignedTrainerForMember(99)).rejects.toThrow(
        "Member not found"
      );
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("99"));
    });
  });

  // =====================================================================
  // updateMemberProfile (complete profile)
  // =====================================================================
  describe("updateMemberProfile", () => {
    const fullData = {
      age: 25,
      height: 180,
      weight: 75,
      gender: "MALE",
      medicalNotes: "None",
      avatarUrl: "https://img/avatar.png",
    } as any;

    it("should update all provided fields and mark the profile as completed", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.member.update.mockResolvedValue({});

      const result = await service.updateMemberProfile(1, fullData);

      expect(db.member.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(db.member.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...fullData, isProfileCompleted: true },
      });
      expect(result).toEqual({ ...fullData, isProfileCompleted: true });
    });

    it("should only include fields that are defined", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.member.update.mockResolvedValue({});

      const result = await service.updateMemberProfile(1, { age: 30 } as any);

      expect(db.member.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { age: 30, isProfileCompleted: true },
      });
      expect(result).toEqual({ age: 30, isProfileCompleted: true });
    });

    it("should keep falsy-but-defined values such as 0 and empty string", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.member.update.mockResolvedValue({});

      const result = await service.updateMemberProfile(1, {
        weight: 0,
        medicalNotes: "",
      } as any);

      expect(result).toEqual({
        weight: 0,
        medicalNotes: "",
        isProfileCompleted: true,
      });
    });

    it("should set only isProfileCompleted when no data is given", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.member.update.mockResolvedValue({});

      const result = await service.updateMemberProfile(1, {} as any);

      expect(result).toEqual({ isProfileCompleted: true });
    });

    it("should throw and not update if the member does not exist", async () => {
      db.member.findUnique.mockResolvedValue(null);

      await expect(service.updateMemberProfile(99, fullData)).rejects.toThrow(
        "Member not found"
      );
      expect(db.member.update).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("99"));
    });

    it("should propagate database errors from update", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.member.update.mockRejectedValue(new Error("db down"));

      await expect(service.updateMemberProfile(1, fullData)).rejects.toThrow(
        "db down"
      );
    });
  });

  // =====================================================================
  // getCurrentMember
  // =====================================================================
  describe("getCurrentMember", () => {
    it("should select the expected profile fields and relations", async () => {
      const member = { name: "John", surname: "Doe" };
      db.member.findUnique.mockResolvedValue(member);

      const result = await service.getCurrentMember(1);

      expect(db.member.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
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
          gym: { select: { name: true } },
          trainer: { select: { name: true, surname: true, email: true } },
          sessions: {
            take: 5,
            orderBy: { checkIn: "desc" },
            select: { checkIn: true, checkOut: true },
          },
        },
      });
      expect(result).toEqual(member);
    });

    it("should not select the password field", async () => {
      db.member.findUnique.mockResolvedValue({});

      await service.getCurrentMember(1);

      const arg = db.member.findUnique.mock.calls[0][0];
      expect(arg.select).not.toHaveProperty("password");
    });

    it("should throw if the member does not exist", async () => {
      db.member.findUnique.mockResolvedValue(null);

      await expect(service.getCurrentMember(99)).rejects.toThrow(
        "Member not found"
      );
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("99"));
    });
  });

  // =====================================================================
  // getMemberPrograms
  // =====================================================================
  describe("getMemberPrograms", () => {
    it("should check that the member exists with a minimal select", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.program.findMany.mockResolvedValue([]);

      await service.getMemberPrograms(1);

      expect(db.member.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true },
      });
    });

    it("should return all programs by default (no isActive filter)", async () => {
      const programs = [{ title: "A" }, { title: "B" }];
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.program.findMany.mockResolvedValue(programs);

      const result = await service.getMemberPrograms(1);

      const arg = db.program.findMany.mock.calls[0][0];
      expect(arg.where).toEqual({ memberId: 1 });
      expect(result).toEqual(programs);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("2 programs")
      );
    });

    it("should filter by isActive when onlyActive is true", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.program.findMany.mockResolvedValue([]);

      await service.getMemberPrograms(1, true);

      const arg = db.program.findMany.mock.calls[0][0];
      expect(arg.where).toEqual({ memberId: 1, isActive: true });
    });

    it("should not filter by isActive when onlyActive is false", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.program.findMany.mockResolvedValue([]);

      await service.getMemberPrograms(1, false);

      const arg = db.program.findMany.mock.calls[0][0];
      expect(arg.where).not.toHaveProperty("isActive");
    });

    it("should order programs, days, exercises and sets correctly", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.program.findMany.mockResolvedValue([]);

      await service.getMemberPrograms(1);

      const arg = db.program.findMany.mock.calls[0][0];
      expect(arg.orderBy).toEqual({ createdAt: "desc" });
      expect(arg.select.days.orderBy).toEqual({ dayOrder: "asc" });
      expect(arg.select.days.select.exercises.orderBy).toEqual({
        orderIndex: "asc",
      });
      expect(
        arg.select.days.select.exercises.select.sets.orderBy
      ).toEqual({ setNumber: "asc" });
    });

    it("should select the expected program fields", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.program.findMany.mockResolvedValue([]);

      await service.getMemberPrograms(1);

      const { select } = db.program.findMany.mock.calls[0][0];
      expect(select).toEqual(
        expect.objectContaining({
          title: true,
          type: true,
          splitType: true,
          isActive: true,
          createdAt: true,
          archivedAt: true,
        })
      );
      expect(select.days.select.exercises.select.exercise).toEqual({
        select: { name: true },
      });
      expect(select.days.select.exercises.select.sets.select).toEqual({
        setNumber: true,
        targetReps: true,
        targetWeight: true,
        rir: true,
      });
    });

    it("should return an empty array when the member has no programs", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.program.findMany.mockResolvedValue([]);

      await expect(service.getMemberPrograms(1)).resolves.toEqual([]);
    });

    it("should throw and not query programs if the member does not exist", async () => {
      db.member.findUnique.mockResolvedValue(null);

      await expect(service.getMemberPrograms(99)).rejects.toThrow(
        "Member not found"
      );
      expect(db.program.findMany).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("99"));
    });
  });

  // =====================================================================
  // getMyPrograms
  // =====================================================================
  describe("getMyPrograms", () => {
    it("should filter programs by memberId and return them", async () => {
      const programs = [{ publicId: "p-1" }];
      db.program.findMany.mockResolvedValue(programs);

      const result = await service.getMyPrograms(1);

      const arg = db.program.findMany.mock.calls[0][0];
      expect(arg.where).toEqual({ memberId: 1 });
      expect(result).toEqual(programs);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("1 programs")
      );
    });

    it("should hide internal ids and expose publicIds at every level", async () => {
      db.program.findMany.mockResolvedValue([]);

      await service.getMyPrograms(1);

      const { select } = db.program.findMany.mock.calls[0][0];
      const day = select.days.select;
      const exercise = day.exercises.select;

      expect(select.id).toBe(false);
      expect(select.publicId).toBe(true);
      expect(day.id).toBe(false);
      expect(day.publicId).toBe(true);
      expect(exercise.id).toBe(false);
      expect(exercise.publicId).toBe(true);
      expect(exercise.exercise.select.id).toBe(false);
      expect(exercise.exercise.select.publicId).toBe(true);
      expect(exercise.sets.select.id).toBe(false);
      expect(exercise.sets.select.publicId).toBe(true);
    });

    it("should include trainer info without exposing the trainer's internal id or password", async () => {
      db.program.findMany.mockResolvedValue([]);

      await service.getMyPrograms(1);

      const { select } = db.program.findMany.mock.calls[0][0];
      expect(select.trainer).toEqual({
        select: { publicId: true, name: true, surname: true, email: true },
      });
      expect(select.trainer.select).not.toHaveProperty("id");
      expect(select.trainer.select).not.toHaveProperty("password");
    });

    it("should order days, exercises and sets", async () => {
      db.program.findMany.mockResolvedValue([]);

      await service.getMyPrograms(1);

      const { select } = db.program.findMany.mock.calls[0][0];
      expect(select.days.orderBy).toEqual({ dayOrder: "asc" });
      expect(select.days.select.exercises.orderBy).toEqual({
        orderIndex: "asc",
      });
      expect(select.days.select.exercises.select.sets.orderBy).toEqual({
        setNumber: "asc",
      });
    });

    it("should select the full exercise details", async () => {
      db.program.findMany.mockResolvedValue([]);

      await service.getMyPrograms(1);

      const { select } = db.program.findMany.mock.calls[0][0];
      expect(select.days.select.exercises.select.exercise.select).toEqual(
        expect.objectContaining({
          name: true,
          category: true,
          bodyPart: true,
          equipment: true,
          targetMuscle: true,
          instructions: true,
          instruction_steps: true,
          gifUrl: true,
          createdAt: true,
        })
      );
    });

    it("should return an empty array when the member has no programs", async () => {
      db.program.findMany.mockResolvedValue([]);

      await expect(service.getMyPrograms(1)).resolves.toEqual([]);
    });

    it("should propagate database errors", async () => {
      db.program.findMany.mockRejectedValue(new Error("db down"));

      await expect(service.getMyPrograms(1)).rejects.toThrow("db down");
    });
  });

  // =====================================================================
  // updateMemberProfileService
  // =====================================================================
  describe("updateMemberProfileService", () => {
    const fullData = {
      name: "John",
      surname: "Doe",
      gender: "MALE",
      phone: "555-0100",
      age: 26,
      height: 181,
      weight: 76,
      medicalNotes: "Knee",
    } as any;

    it("should update all provided fields and return the selected member", async () => {
      const updated = { id: 1, publicId: "m-1", name: "John" };
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.member.update.mockResolvedValue(updated);

      const result = await service.updateMemberProfileService(1, fullData);

      expect(db.member.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: fullData,
        select: {
          id: true,
          publicId: true,
          name: true,
          surname: true,
          email: true,
          phone: true,
          gender: true,
          age: true,
          height: true,
          weight: true,
          avatarUrl: true,
          medicalNotes: true,
          assignmentStatus: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(updated);
    });

    it("should only send fields that are defined", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.member.update.mockResolvedValue({});

      await service.updateMemberProfileService(1, {
        name: "Johnny",
        phone: "555-0199",
      } as any);

      const arg = db.member.update.mock.calls[0][0];
      expect(arg.data).toEqual({ name: "Johnny", phone: "555-0199" });
    });

    it("should keep falsy-but-defined values such as 0 and empty string", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.member.update.mockResolvedValue({});

      await service.updateMemberProfileService(1, {
        age: 0,
        medicalNotes: "",
      } as any);

      const arg = db.member.update.mock.calls[0][0];
      expect(arg.data).toEqual({ age: 0, medicalNotes: "" });
    });

    it("should send an empty data object when nothing is provided", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.member.update.mockResolvedValue({});

      await service.updateMemberProfileService(1, {} as any);

      const arg = db.member.update.mock.calls[0][0];
      expect(arg.data).toEqual({});
    });

    it("should never update email, password or isProfileCompleted", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.member.update.mockResolvedValue({});

      await service.updateMemberProfileService(1, {
        ...fullData,
        email: "hacker@test.com",
        password: "newpass",
        isProfileCompleted: false,
      });

      const arg = db.member.update.mock.calls[0][0];
      expect(arg.data).not.toHaveProperty("email");
      expect(arg.data).not.toHaveProperty("password");
      expect(arg.data).not.toHaveProperty("isProfileCompleted");
    });

    it("should not select the password in the returned member", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.member.update.mockResolvedValue({});

      await service.updateMemberProfileService(1, fullData);

      const arg = db.member.update.mock.calls[0][0];
      expect(arg.select).not.toHaveProperty("password");
    });

    it("should throw and not update if the member does not exist", async () => {
      db.member.findUnique.mockResolvedValue(null);

      await expect(
        service.updateMemberProfileService(99, fullData)
      ).rejects.toThrow("Member not found");
      expect(db.member.update).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("99"));
    });

    it("should propagate database errors from update", async () => {
      db.member.findUnique.mockResolvedValue({ id: 1 });
      db.member.update.mockRejectedValue(new Error("db down"));

      await expect(
        service.updateMemberProfileService(1, fullData)
      ).rejects.toThrow("db down");
    });
  });
});