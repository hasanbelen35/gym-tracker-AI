import prisma from "../../src/lib/db";
import { logger } from "../../src/config/logger";
import { TrainerService } from "../../src/services/trainer.service";

jest.mock("../../src/lib/db", () => ({
  __esModule: true,
  default: {
    member: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
    },
    memberMeasurement: {
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
    trainer: { findUnique: jest.fn(), update: jest.fn() },
  },
}));

jest.mock("../../src/config/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn() },
}));

const db = prisma as unknown as {
  member: { findMany: jest.Mock; findFirst: jest.Mock; updateMany: jest.Mock };
  memberMeasurement: {
    create: jest.Mock;
    findFirst: jest.Mock;
    delete: jest.Mock;
  };
  trainer: { findUnique: jest.Mock; update: jest.Mock };
};

describe("TrainerService", () => {
  let service: TrainerService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new TrainerService();
  });

  // =====================================================================
  // requestMemberAssignment
  // =====================================================================
  describe("requestMemberAssignment", () => {
    it("should set an UNASSIGNED member of the gym to PENDING for this trainer", async () => {
      db.member.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.requestMemberAssignment("m-1", 5, "g-1");

      expect(db.member.updateMany).toHaveBeenCalledWith({
        where: {
          publicId: "m-1",
          gym: { publicId: "g-1" },
          assignmentStatus: "UNASSIGNED",
        },
        data: { trainerId: 5, assignmentStatus: "PENDING" },
      });
      expect(result).toEqual({ count: 1 });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining("m-1"));
    });

    it("should return count 0 when no unassigned member matches", async () => {
      db.member.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.requestMemberAssignment("m-1", 5, "g-1")
      ).resolves.toEqual({ count: 0 });
    });

    it("should propagate database errors", async () => {
      db.member.updateMany.mockRejectedValue(new Error("db down"));

      await expect(
        service.requestMemberAssignment("m-1", 5, "g-1")
      ).rejects.toThrow("db down");
    });
  });

  // =====================================================================
  // cancelMyAssignmentRequest
  // =====================================================================
  describe("cancelMyAssignmentRequest", () => {
    it("should unassign PENDING or ASSIGNED members that belong to this trainer", async () => {
      db.member.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.cancelMyAssignmentRequest("m-1", 5, "g-1");

      expect(db.member.updateMany).toHaveBeenCalledWith({
        where: {
          publicId: "m-1",
          trainerId: 5,
          gym: { publicId: "g-1" },
          assignmentStatus: { in: ["PENDING", "ASSIGNED"] },
        },
        data: { trainerId: null, assignmentStatus: "UNASSIGNED" },
      });
      expect(result).toEqual({ count: 1 });
    });

    it("should only target members of the requesting trainer", async () => {
      db.member.updateMany.mockResolvedValue({ count: 0 });

      await service.cancelMyAssignmentRequest("m-1", 7, "g-1");

      const arg = db.member.updateMany.mock.calls[0][0];
      expect(arg.where.trainerId).toBe(7);
    });

    it("should return count 0 when nothing matches", async () => {
      db.member.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.cancelMyAssignmentRequest("m-1", 5, "g-1")
      ).resolves.toEqual({ count: 0 });
    });

    it("should propagate database errors", async () => {
      db.member.updateMany.mockRejectedValue(new Error("db down"));

      await expect(
        service.cancelMyAssignmentRequest("m-1", 5, "g-1")
      ).rejects.toThrow("db down");
    });
  });

  // =====================================================================
  // getMembersByStatus
  // =====================================================================
  describe("getMembersByStatus", () => {
    const expectedSelect = {
      publicId: true,
      name: true,
      surname: true,
      email: true,
      avatarUrl: true,
      assignmentStatus: true,
    };

    it.each(["PENDING", "ASSIGNED"] as const)(
      "should filter %s members by the trainer id",
      async (status) => {
        const members = [{ publicId: "m-1", assignmentStatus: status }];
        db.member.findMany.mockResolvedValue(members);

        const result = await service.getMembersByStatus(5, "g-1", status);

        expect(db.member.findMany).toHaveBeenCalledWith({
          where: {
            trainerId: 5,
            gym: { publicId: "g-1" },
            assignmentStatus: status,
          },
          select: expectedSelect,
        });
        expect(result).toEqual(members);
      }
    );

    it("should filter UNASSIGNED members by trainerId null", async () => {
      db.member.findMany.mockResolvedValue([]);

      await service.getMembersByStatus(5, "g-1", "UNASSIGNED");

      expect(db.member.findMany).toHaveBeenCalledWith({
        where: {
          trainerId: null,
          gym: { publicId: "g-1" },
          assignmentStatus: "UNASSIGNED",
        },
        select: expectedSelect,
      });
    });

    it("should not select the password field", async () => {
      db.member.findMany.mockResolvedValue([]);

      await service.getMembersByStatus(5, "g-1", "PENDING");

      const arg = db.member.findMany.mock.calls[0][0];
      expect(arg.select).not.toHaveProperty("password");
    });

    it("should return an empty array when nobody matches", async () => {
      db.member.findMany.mockResolvedValue([]);

      await expect(
        service.getMembersByStatus(5, "g-1", "ASSIGNED")
      ).resolves.toEqual([]);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("0 members")
      );
    });
  });

  // =====================================================================
  // getMemberDetail
  // =====================================================================
  describe("getMemberDetail", () => {
    it("should only look up ASSIGNED members of this trainer", async () => {
      const member = { publicId: "m-1", name: "John" };
      db.member.findFirst.mockResolvedValue(member);

      const result = await service.getMemberDetail(5, "m-1");

      expect(db.member.findFirst).toHaveBeenCalledWith({
        where: {
          publicId: "m-1",
          trainerId: 5,
          assignmentStatus: "ASSIGNED",
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
          medicalNotes: true,
          gender: true,
          avatarUrl: true,
          gym: { select: { name: true } },
          programs: { orderBy: { createdAt: "desc" }, take: 5 },
          sessions: { orderBy: { checkIn: "desc" }, take: 10 },
        },
      });
      expect(result).toEqual(member);
    });

    it("should not select the password field", async () => {
      db.member.findFirst.mockResolvedValue({});

      await service.getMemberDetail(5, "m-1");

      const arg = db.member.findFirst.mock.calls[0][0];
      expect(arg.select).not.toHaveProperty("password");
    });

    it("should throw if the member is not found or not assigned", async () => {
      db.member.findFirst.mockResolvedValue(null);

      await expect(service.getMemberDetail(5, "m-1")).rejects.toThrow(
        "Member not found or you do not have access to this member."
      );
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("m-1"));
    });
  });

  // =====================================================================
  // addMemberMeasurement
  // =====================================================================
  describe("addMemberMeasurement", () => {
    const dto = {
      bodyFatRate: 15,
      muscleMass: 40,
      chest: 100,
      waist: 80,
      arm: 35,
      hip: 95,
      shoulder: 120,
      photos: ["a.png", "b.png"],
      notes: "Good progress",
    } as any;

    it("should check ownership and create the measurement with all fields", async () => {
      db.member.findFirst.mockResolvedValue({ id: 10 });
      db.memberMeasurement.create.mockResolvedValue({ id: 1, memberId: 10 });

      const result = await service.addMemberMeasurement(5, "m-1", dto);

      expect(db.member.findFirst).toHaveBeenCalledWith({
        where: {
          publicId: "m-1",
          trainerId: 5,
          assignmentStatus: "ASSIGNED",
        },
        select: { id: true },
      });
      expect(db.memberMeasurement.create).toHaveBeenCalledWith({
        data: { memberId: 10, ...dto },
      });
      expect(result).toEqual({ id: 1, memberId: 10 });
    });

    it("should default photos to an empty array when not provided", async () => {
      db.member.findFirst.mockResolvedValue({ id: 10 });
      db.memberMeasurement.create.mockResolvedValue({ id: 1 });

      await service.addMemberMeasurement(5, "m-1", {
        ...dto,
        photos: undefined,
      });

      const arg = db.memberMeasurement.create.mock.calls[0][0];
      expect(arg.data.photos).toEqual([]);
    });

    it("should only pass whitelisted fields to prisma", async () => {
      db.member.findFirst.mockResolvedValue({ id: 10 });
      db.memberMeasurement.create.mockResolvedValue({ id: 1 });

      await service.addMemberMeasurement(5, "m-1", {
        ...dto,
        memberId: 999,
        publicId: "forged",
      });

      const arg = db.memberMeasurement.create.mock.calls[0][0];
      expect(arg.data.memberId).toBe(10);
      expect(arg.data).not.toHaveProperty("publicId");
    });

    it("should throw and not create if the member is not found or unauthorized", async () => {
      db.member.findFirst.mockResolvedValue(null);

      await expect(
        service.addMemberMeasurement(5, "m-1", dto)
      ).rejects.toThrow(
        "Member not found or you do not have permission to add measurements for this member."
      );
      expect(db.memberMeasurement.create).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("m-1"));
    });

    it("should propagate database errors from create", async () => {
      db.member.findFirst.mockResolvedValue({ id: 10 });
      db.memberMeasurement.create.mockRejectedValue(new Error("db down"));

      await expect(
        service.addMemberMeasurement(5, "m-1", dto)
      ).rejects.toThrow("db down");
    });
  });

  // =====================================================================
  // getMemberMeasurements
  // =====================================================================
  describe("getMemberMeasurements", () => {
    it("should return the measurements ordered by measuredAt desc", async () => {
      const measurements = [{ id: 2 }, { id: 1 }];
      db.member.findFirst.mockResolvedValue({ id: 10, measurements });

      const result = await service.getMemberMeasurements(5, "m-1");

      expect(db.member.findFirst).toHaveBeenCalledWith({
        where: {
          publicId: "m-1",
          trainerId: 5,
          assignmentStatus: "ASSIGNED",
        },
        select: {
          id: true,
          measurements: { orderBy: { measuredAt: "desc" } },
        },
      });
      expect(result).toEqual(measurements);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("2 measurements")
      );
    });

    it("should return an empty array when the member has no measurements", async () => {
      db.member.findFirst.mockResolvedValue({ id: 10, measurements: [] });

      await expect(service.getMemberMeasurements(5, "m-1")).resolves.toEqual(
        []
      );
    });

    it("should throw if the member is not found or unauthorized", async () => {
      db.member.findFirst.mockResolvedValue(null);

      await expect(service.getMemberMeasurements(5, "m-1")).rejects.toThrow(
        "Member not found or you do not have access to this member's measurements."
      );
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("m-1"));
    });
  });

  // =====================================================================
  // deleteMemberMeasurement
  // =====================================================================
  describe("deleteMemberMeasurement", () => {
    it("should delete the measurement after verifying member and measurement", async () => {
      const deleted = { id: 1, publicId: "ms-1" };
      db.member.findFirst.mockResolvedValue({ id: 10 });
      db.memberMeasurement.findFirst.mockResolvedValue({ id: 1 });
      db.memberMeasurement.delete.mockResolvedValue(deleted);

      const result = await service.deleteMemberMeasurement(5, "m-1", "ms-1");

      expect(db.member.findFirst).toHaveBeenCalledWith({
        where: {
          publicId: "m-1",
          trainerId: 5,
          assignmentStatus: "ASSIGNED",
        },
        select: { id: true },
      });
      expect(db.memberMeasurement.findFirst).toHaveBeenCalledWith({
        where: { publicId: "ms-1", memberId: 10 },
      });
      expect(db.memberMeasurement.delete).toHaveBeenCalledWith({
        where: { publicId: "ms-1" },
      });
      expect(result).toEqual(deleted);
    });

    it("should throw and not look up measurements if the member is unauthorized", async () => {
      db.member.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteMemberMeasurement(5, "m-1", "ms-1")
      ).rejects.toThrow(
        "Member not found or you do not have permission to modify this member's measurements."
      );
      expect(db.memberMeasurement.findFirst).not.toHaveBeenCalled();
      expect(db.memberMeasurement.delete).not.toHaveBeenCalled();
    });

    it("should throw and not delete if the measurement belongs to another member", async () => {
      db.member.findFirst.mockResolvedValue({ id: 10 });
      db.memberMeasurement.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteMemberMeasurement(5, "m-1", "ms-other")
      ).rejects.toThrow("Measurement record not found.");
      expect(db.memberMeasurement.delete).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("ms-other")
      );
    });

    it("should propagate database errors from delete", async () => {
      db.member.findFirst.mockResolvedValue({ id: 10 });
      db.memberMeasurement.findFirst.mockResolvedValue({ id: 1 });
      db.memberMeasurement.delete.mockRejectedValue(new Error("db down"));

      await expect(
        service.deleteMemberMeasurement(5, "m-1", "ms-1")
      ).rejects.toThrow("db down");
    });
  });

  // =====================================================================
  // completeTrainerProfileService
  // =====================================================================
  describe("completeTrainerProfileService", () => {
    const fullData = {
      phone: "555-0100",
      gender: "FEMALE",
      age: 30,
      height: 170,
      weight: 60,
      avatarUrl: "https://img/avatar.png",
    } as any;

    it("should update provided fields, mark the profile completed and return the selected trainer", async () => {
      const updated = { id: 5, isProfileCompleted: true };
      db.trainer.findUnique.mockResolvedValue({ id: 5 });
      db.trainer.update.mockResolvedValue(updated);

      const result = await service.completeTrainerProfileService(5, fullData);

      expect(db.trainer.findUnique).toHaveBeenCalledWith({ where: { id: 5 } });
      expect(db.trainer.update).toHaveBeenCalledWith({
        where: { id: 5 },
        data: { ...fullData, isProfileCompleted: true },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          phone: true,
          gender: true,
          age: true,
          height: true,
          weight: true,
          avatarUrl: true,
          isProfileCompleted: true,
        },
      });
      expect(result).toEqual(updated);
    });

    it("should only send fields that are defined", async () => {
      db.trainer.findUnique.mockResolvedValue({ id: 5 });
      db.trainer.update.mockResolvedValue({});

      await service.completeTrainerProfileService(5, { phone: "555-0199" });

      const arg = db.trainer.update.mock.calls[0][0];
      expect(arg.data).toEqual({
        phone: "555-0199",
        isProfileCompleted: true,
      });
    });

    it("should keep falsy-but-defined values such as 0 and empty string", async () => {
      db.trainer.findUnique.mockResolvedValue({ id: 5 });
      db.trainer.update.mockResolvedValue({});

      await service.completeTrainerProfileService(5, {
        age: 0,
        phone: "",
      });

      const arg = db.trainer.update.mock.calls[0][0];
      expect(arg.data).toEqual({
        age: 0,
        phone: "",
        isProfileCompleted: true,
      });
    });

    it("should set only isProfileCompleted when no data is given", async () => {
      db.trainer.findUnique.mockResolvedValue({ id: 5 });
      db.trainer.update.mockResolvedValue({});

      await service.completeTrainerProfileService(5, {});

      const arg = db.trainer.update.mock.calls[0][0];
      expect(arg.data).toEqual({ isProfileCompleted: true });
    });

    it("should never update email, password or name fields", async () => {
      db.trainer.findUnique.mockResolvedValue({ id: 5 });
      db.trainer.update.mockResolvedValue({});

      await service.completeTrainerProfileService(5, {
        ...fullData,
        email: "hacker@test.com",
        password: "newpass",
        name: "Hacker",
      });

      const arg = db.trainer.update.mock.calls[0][0];
      expect(arg.data).not.toHaveProperty("email");
      expect(arg.data).not.toHaveProperty("password");
      expect(arg.data).not.toHaveProperty("name");
      expect(arg.select).not.toHaveProperty("password");
    });

    it("should throw and not update if the trainer does not exist", async () => {
      db.trainer.findUnique.mockResolvedValue(null);

      await expect(
        service.completeTrainerProfileService(99, fullData)
      ).rejects.toThrow("Trainer not found");
      expect(db.trainer.update).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("99"));
    });

    it("should propagate database errors from update", async () => {
      db.trainer.findUnique.mockResolvedValue({ id: 5 });
      db.trainer.update.mockRejectedValue(new Error("db down"));

      await expect(
        service.completeTrainerProfileService(5, fullData)
      ).rejects.toThrow("db down");
    });
  });

  // =====================================================================
  // getTrainerProfileWithGym
  // =====================================================================
  describe("getTrainerProfileWithGym", () => {
    it("should select the expected profile fields with the gym name", async () => {
      const trainer = { id: 5, name: "Jane", gym: { name: "Test Gym" } };
      db.trainer.findUnique.mockResolvedValue(trainer);

      const result = await service.getTrainerProfileWithGym(5);

      expect(db.trainer.findUnique).toHaveBeenCalledWith({
        where: { id: 5 },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          gender: true,
          age: true,
          height: true,
          weight: true,
          phone: true,
          avatarUrl: true,
          createdAt: true,
          gym: { select: { name: true } },
        },
      });
      expect(result).toEqual(trainer);
    });

    it("should not select the password field", async () => {
      db.trainer.findUnique.mockResolvedValue({});

      await service.getTrainerProfileWithGym(5);

      const arg = db.trainer.findUnique.mock.calls[0][0];
      expect(arg.select).not.toHaveProperty("password");
    });

    it("should throw if the trainer does not exist", async () => {
      db.trainer.findUnique.mockResolvedValue(null);

      await expect(service.getTrainerProfileWithGym(99)).rejects.toThrow(
        "Trainer not found."
      );
    });
  });

  // =====================================================================
  // updateTrainerProfileService
  // =====================================================================
  describe("updateTrainerProfileService", () => {
    const fullData = {
      name: "Jane",
      surname: "Smith",
      gender: "FEMALE",
      phone: "555-0100",
      age: 31,
      height: 171,
      weight: 61,
    } as any;

    it("should update all provided fields and return the selected trainer", async () => {
      const updated = { id: 5, name: "Jane" };
      db.trainer.findUnique.mockResolvedValue({ id: 5 });
      db.trainer.update.mockResolvedValue(updated);

      const result = await service.updateTrainerProfileService(5, fullData);

      expect(db.trainer.update).toHaveBeenCalledWith({
        where: { id: 5 },
        data: fullData,
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          phone: true,
          gender: true,
          age: true,
          height: true,
          weight: true,
          avatarUrl: true,
          isProfileCompleted: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(updated);
    });

    it("should only send fields that are defined", async () => {
      db.trainer.findUnique.mockResolvedValue({ id: 5 });
      db.trainer.update.mockResolvedValue({});

      await service.updateTrainerProfileService(5, { name: "Janet" } as any);

      const arg = db.trainer.update.mock.calls[0][0];
      expect(arg.data).toEqual({ name: "Janet" });
    });

    it("should keep falsy-but-defined values such as 0 and empty string", async () => {
      db.trainer.findUnique.mockResolvedValue({ id: 5 });
      db.trainer.update.mockResolvedValue({});

      await service.updateTrainerProfileService(5, {
        age: 0,
        phone: "",
      } as any);

      const arg = db.trainer.update.mock.calls[0][0];
      expect(arg.data).toEqual({ age: 0, phone: "" });
    });

    it("should send an empty data object when nothing is provided", async () => {
      db.trainer.findUnique.mockResolvedValue({ id: 5 });
      db.trainer.update.mockResolvedValue({});

      await service.updateTrainerProfileService(5, {} as any);

      const arg = db.trainer.update.mock.calls[0][0];
      expect(arg.data).toEqual({});
    });

    it("should never update email, password, avatarUrl or isProfileCompleted", async () => {
      db.trainer.findUnique.mockResolvedValue({ id: 5 });
      db.trainer.update.mockResolvedValue({});

      await service.updateTrainerProfileService(5, {
        ...fullData,
        email: "hacker@test.com",
        password: "newpass",
        avatarUrl: "https://evil/avatar.png",
        isProfileCompleted: false,
      });

      const arg = db.trainer.update.mock.calls[0][0];
      expect(arg.data).not.toHaveProperty("email");
      expect(arg.data).not.toHaveProperty("password");
      expect(arg.data).not.toHaveProperty("avatarUrl");
      expect(arg.data).not.toHaveProperty("isProfileCompleted");
      expect(arg.select).not.toHaveProperty("password");
    });

    it("should throw and not update if the trainer does not exist", async () => {
      db.trainer.findUnique.mockResolvedValue(null);

      await expect(
        service.updateTrainerProfileService(99, fullData)
      ).rejects.toThrow("Trainer not found");
      expect(db.trainer.update).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining("99"));
    });

    it("should propagate database errors from update", async () => {
      db.trainer.findUnique.mockResolvedValue({ id: 5 });
      db.trainer.update.mockRejectedValue(new Error("db down"));

      await expect(
        service.updateTrainerProfileService(5, fullData)
      ).rejects.toThrow("db down");
    });
  });
});