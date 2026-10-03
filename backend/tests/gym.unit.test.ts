import prisma from "../src/lib/db";
import { logger } from "../src/config/logger";
import { GymService } from "../src/services/gym.service";

// ---------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------
// The same object is used as the `tx` inside $transaction so we can
// assert on calls made through either `prisma` or `tx`.
jest.mock("../../src/lib/db", () => {
  const client = {
    gym: { findMany: jest.fn() },
    member: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
    trainer: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
    session: { deleteMany: jest.fn() },
    program: { deleteMany: jest.fn() },
    $transaction: jest.fn(),
  };
  return { __esModule: true, default: client };
});

jest.mock("../../src/config/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn() },
}));

const db = prisma as unknown as {
  gym: { findMany: jest.Mock };
  member: {
    findMany: jest.Mock;
    findFirst: jest.Mock;
    updateMany: jest.Mock;
    delete: jest.Mock;
  };
  trainer: { findMany: jest.Mock; findFirst: jest.Mock; delete: jest.Mock };
  session: { deleteMany: jest.Mock };
  program: { deleteMany: jest.Mock };
  $transaction: jest.Mock;
};

/** Returns the index at which a mock was first called (for ordering checks). */
const callOrder = (fn: jest.Mock) => fn.mock.invocationCallOrder[0];

describe("GymService", () => {
  let service: GymService;

  beforeEach(() => {
    jest.resetAllMocks();
    // $transaction(cb) -> cb(tx), where tx is the same mocked client
    db.$transaction.mockImplementation(async (cb: (tx: unknown) => unknown) =>
      cb(db)
    );
    service = new GymService();
  });

  // =====================================================================
  // GYM
  // =====================================================================
  describe("getAllGymData", () => {
    it("should return only id and name of all gyms", async () => {
      const gyms = [
        { id: 1, name: "Gym A" },
        { id: 2, name: "Gym B" },
      ];
      db.gym.findMany.mockResolvedValue(gyms);

      const result = await service.getAllGymData();

      expect(db.gym.findMany).toHaveBeenCalledWith({
        select: { id: true, name: true },
      });
      expect(result).toEqual(gyms);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("2 gyms")
      );
    });

    it("should return an empty array when there are no gyms", async () => {
      db.gym.findMany.mockResolvedValue([]);

      await expect(service.getAllGymData()).resolves.toEqual([]);
    });

    it("should propagate database errors", async () => {
      db.gym.findMany.mockRejectedValue(new Error("db down"));

      await expect(service.getAllGymData()).rejects.toThrow("db down");
    });
  });

  // =====================================================================
  // MEMBERS
  // =====================================================================
  describe("getAllMembers", () => {
    it("should select the expected fields including trainer name", async () => {
      const members = [
        {
          id: 1,
          publicId: "m-1",
          name: "John",
          surname: "Doe",
          email: "john@test.com",
          gymId: 1,
          assignmentStatus: "ASSIGNED",
          trainer: { name: "Jane", surname: "Smith" },
        },
      ];
      db.member.findMany.mockResolvedValue(members);

      const result = await service.getAllMembers();

      expect(db.member.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          publicId: true,
          name: true,
          surname: true,
          email: true,
          gymId: true,
          assignmentStatus: true,
          trainer: { select: { name: true, surname: true } },
        },
      });
      expect(result).toEqual(members);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("1 members")
      );
    });

    it("should not select the password field", async () => {
      db.member.findMany.mockResolvedValue([]);

      await service.getAllMembers();

      const arg = db.member.findMany.mock.calls[0][0];
      expect(arg.select).not.toHaveProperty("password");
    });

    it("should return an empty array when there are no members", async () => {
      db.member.findMany.mockResolvedValue([]);

      await expect(service.getAllMembers()).resolves.toEqual([]);
    });
  });

  describe("removeMemberFromGym", () => {
    const member = { id: 10, publicId: "m-10", gymId: 1 };

    it("should delete sessions, programs and then the member inside a transaction", async () => {
      db.member.findFirst.mockResolvedValue(member);
      db.session.deleteMany.mockResolvedValue({ count: 3 });
      db.program.deleteMany.mockResolvedValue({ count: 2 });
      db.member.delete.mockResolvedValue(member);

      const result = await service.removeMemberFromGym(1, "m-10");

      expect(db.$transaction).toHaveBeenCalledTimes(1);
      expect(db.member.findFirst).toHaveBeenCalledWith({
        where: { publicId: "m-10", gymId: 1 },
      });
      expect(db.session.deleteMany).toHaveBeenCalledWith({
        where: { memberId: 10 },
      });
      expect(db.program.deleteMany).toHaveBeenCalledWith({
        where: { memberId: 10 },
      });
      expect(db.member.delete).toHaveBeenCalledWith({ where: { id: 10 } });
      expect(result).toEqual(member);
    });

    it("should delete child records before deleting the member", async () => {
      db.member.findFirst.mockResolvedValue(member);
      db.member.delete.mockResolvedValue(member);

      await service.removeMemberFromGym(1, "m-10");

      expect(callOrder(db.session.deleteMany)).toBeLessThan(
        callOrder(db.member.delete)
      );
      expect(callOrder(db.program.deleteMany)).toBeLessThan(
        callOrder(db.member.delete)
      );
    });

    it("should throw and delete nothing if the member is not in this gym", async () => {
      db.member.findFirst.mockResolvedValue(null);

      await expect(service.removeMemberFromGym(1, "missing")).rejects.toThrow(
        "Member not found in this gym"
      );

      expect(db.session.deleteMany).not.toHaveBeenCalled();
      expect(db.program.deleteMany).not.toHaveBeenCalled();
      expect(db.member.delete).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("missing")
      );
    });

    it("should scope the lookup by gymId (member of another gym is not removable)", async () => {
      db.member.findFirst.mockResolvedValue(null);

      await expect(service.removeMemberFromGym(2, "m-10")).rejects.toThrow();

      expect(db.member.findFirst).toHaveBeenCalledWith({
        where: { publicId: "m-10", gymId: 2 },
      });
    });

    it("should propagate errors thrown while deleting (transaction rollback)", async () => {
      db.member.findFirst.mockResolvedValue(member);
      db.session.deleteMany.mockRejectedValue(new Error("fk violation"));

      await expect(service.removeMemberFromGym(1, "m-10")).rejects.toThrow(
        "fk violation"
      );
      expect(db.member.delete).not.toHaveBeenCalled();
    });
  });

  describe("getMemberDetail", () => {
    it("should query by publicId and gymId with the expected relations", async () => {
      const member = { id: 1, publicId: "m-1", name: "John" };
      db.member.findFirst.mockResolvedValue(member);

      const result = await service.getMemberDetail(1, "m-1");

      expect(db.member.findFirst).toHaveBeenCalledWith({
        where: { publicId: "m-1", gymId: 1 },
        select: {
          id: true,
          publicId: true,
          name: true,
          surname: true,
          email: true,
          age: true,
          height: true,
          weight: true,
          phone: true,
          createdAt: true,
          trainer: {
            select: { id: true, publicId: true, name: true, surname: true },
          },
          sessions: {
            orderBy: { checkIn: "desc" },
            take: 20,
            select: {
              id: true,
              checkIn: true,
              checkOut: true,
              duration: true,
            },
          },
          programs: {
            orderBy: { createdAt: "desc" },
            select: { id: true, type: true, content: true, createdAt: true },
          },
        },
      });
      expect(result).toEqual(member);
    });

    it("should not select the password field", async () => {
      db.member.findFirst.mockResolvedValue({ id: 1 });

      await service.getMemberDetail(1, "m-1");

      const arg = db.member.findFirst.mock.calls[0][0];
      expect(arg.select).not.toHaveProperty("password");
    });

    it("should throw if the member is not found in this gym", async () => {
      db.member.findFirst.mockResolvedValue(null);

      await expect(service.getMemberDetail(1, "missing")).rejects.toThrow(
        "Member not found in this gym"
      );
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("missing")
      );
    });
  });

  // =====================================================================
  // TRAINERS
  // =====================================================================
  describe("getAllTrainers", () => {
    it("should select the expected fields", async () => {
      const trainers = [
        {
          id: 1,
          publicId: "t-1",
          name: "Jane",
          surname: "Smith",
          email: "jane@test.com",
          gymId: 1,
        },
      ];
      db.trainer.findMany.mockResolvedValue(trainers);

      const result = await service.getAllTrainers();

      expect(db.trainer.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          publicId: true,
          name: true,
          surname: true,
          email: true,
          gymId: true,
        },
      });
      expect(result).toEqual(trainers);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("1 trainers")
      );
    });

    it("should not select the password field", async () => {
      db.trainer.findMany.mockResolvedValue([]);

      await service.getAllTrainers();

      const arg = db.trainer.findMany.mock.calls[0][0];
      expect(arg.select).not.toHaveProperty("password");
    });

    it("should return an empty array when there are no trainers", async () => {
      db.trainer.findMany.mockResolvedValue([]);

      await expect(service.getAllTrainers()).resolves.toEqual([]);
    });
  });

  describe("removeTrainerFromGym", () => {
    const trainer = { id: 5, publicId: "t-5", gymId: 1 };

    it("should unassign members, delete programs and delete the trainer in a transaction", async () => {
      db.trainer.findFirst.mockResolvedValue(trainer);
      db.member.updateMany.mockResolvedValue({ count: 4 });
      db.program.deleteMany.mockResolvedValue({ count: 2 });
      db.trainer.delete.mockResolvedValue(trainer);

      const result = await service.removeTrainerFromGym(1, "t-5");

      expect(db.$transaction).toHaveBeenCalledTimes(1);
      expect(db.trainer.findFirst).toHaveBeenCalledWith({
        where: { publicId: "t-5", gymId: 1 },
      });
      expect(db.member.updateMany).toHaveBeenCalledWith({
        where: { trainer: { publicId: "t-5" } },
        data: { assignmentStatus: "UNASSIGNED", trainerId: null },
      });
      expect(db.program.deleteMany).toHaveBeenCalledWith({
        where: { trainerId: 5 },
      });
      expect(db.trainer.delete).toHaveBeenCalledWith({ where: { id: 5 } });
      expect(result).toEqual(trainer);
    });

    it("should unassign members and delete programs before deleting the trainer", async () => {
      db.trainer.findFirst.mockResolvedValue(trainer);
      db.trainer.delete.mockResolvedValue(trainer);

      await service.removeTrainerFromGym(1, "t-5");

      expect(callOrder(db.member.updateMany)).toBeLessThan(
        callOrder(db.trainer.delete)
      );
      expect(callOrder(db.program.deleteMany)).toBeLessThan(
        callOrder(db.trainer.delete)
      );
    });

    it("should throw and change nothing if the trainer is not in this gym", async () => {
      db.trainer.findFirst.mockResolvedValue(null);

      await expect(service.removeTrainerFromGym(1, "missing")).rejects.toThrow(
        "Trainer not found in this gym"
      );

      expect(db.member.updateMany).not.toHaveBeenCalled();
      expect(db.program.deleteMany).not.toHaveBeenCalled();
      expect(db.trainer.delete).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("missing")
      );
    });

    it("should propagate errors thrown while deleting (transaction rollback)", async () => {
      db.trainer.findFirst.mockResolvedValue(trainer);
      db.member.updateMany.mockResolvedValue({ count: 0 });
      db.program.deleteMany.mockRejectedValue(new Error("fk violation"));

      await expect(service.removeTrainerFromGym(1, "t-5")).rejects.toThrow(
        "fk violation"
      );
      expect(db.trainer.delete).not.toHaveBeenCalled();
    });
  });

  describe("getTrainerDetail", () => {
    it("should query by publicId and gymId with the expected relations", async () => {
      const trainer = { id: 1, publicId: "t-1", name: "Jane" };
      db.trainer.findFirst.mockResolvedValue(trainer);

      const result = await service.getTrainerDetail(1, "t-1");

      expect(db.trainer.findFirst).toHaveBeenCalledWith({
        where: { publicId: "t-1", gymId: 1 },
        select: {
          id: true,
          publicId: true,
          avatarUrl: true,
          name: true,
          surname: true,
          email: true,
          createdAt: true,
          myMembers: {
            select: {
              id: true,
              publicId: true,
              name: true,
              surname: true,
              email: true,
            },
          },
          programs: {
            orderBy: { createdAt: "desc" },
            take: 20,
            select: {
              id: true,
              title: true,
              splitType: true,
              isActive: true,
              createdAt: true,
              member: {
                select: {
                  id: true,
                  publicId: true,
                  name: true,
                  surname: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(trainer);
    });

    it("should not select the password field", async () => {
      db.trainer.findFirst.mockResolvedValue({ id: 1 });

      await service.getTrainerDetail(1, "t-1");

      const arg = db.trainer.findFirst.mock.calls[0][0];
      expect(arg.select).not.toHaveProperty("password");
    });

    it("should throw if the trainer is not found in this gym", async () => {
      db.trainer.findFirst.mockResolvedValue(null);

      await expect(service.getTrainerDetail(1, "missing")).rejects.toThrow(
        "Trainer not found in this gym"
      );
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("missing")
      );
    });
  });

  // =====================================================================
  // ASSIGNMENT APPROVAL / REJECTION
  // =====================================================================
  describe("approveMemberAssignment", () => {
    it("should set PENDING members of this gym to ASSIGNED", async () => {
      db.member.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.approveMemberAssignment("m-1", 1);

      expect(db.member.updateMany).toHaveBeenCalledWith({
        where: { publicId: "m-1", gymId: 1, assignmentStatus: "PENDING" },
        data: { assignmentStatus: "ASSIGNED" },
      });
      expect(result).toEqual({ count: 1 });
    });

    it("should return count 0 when no pending member matches", async () => {
      db.member.updateMany.mockResolvedValue({ count: 0 });

      const result = await service.approveMemberAssignment("m-1", 1);

      expect(result).toEqual({ count: 0 });
    });

    it("should not change trainerId when approving", async () => {
      db.member.updateMany.mockResolvedValue({ count: 1 });

      await service.approveMemberAssignment("m-1", 1);

      const arg = db.member.updateMany.mock.calls[0][0];
      expect(arg.data).not.toHaveProperty("trainerId");
    });

    it("should propagate database errors", async () => {
      db.member.updateMany.mockRejectedValue(new Error("db down"));

      await expect(service.approveMemberAssignment("m-1", 1)).rejects.toThrow(
        "db down"
      );
    });
  });

  describe("rejectMemberAssignment", () => {
    it("should unassign the trainer of PENDING members of this gym", async () => {
      db.member.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.rejectMemberAssignment("m-1", 1);

      expect(db.member.updateMany).toHaveBeenCalledWith({
        where: { publicId: "m-1", gymId: 1, assignmentStatus: "PENDING" },
        data: { trainerId: null, assignmentStatus: "UNASSIGNED" },
      });
      expect(result).toEqual({ count: 1 });
    });

    it("should return count 0 when no pending member matches", async () => {
      db.member.updateMany.mockResolvedValue({ count: 0 });

      const result = await service.rejectMemberAssignment("m-1", 1);

      expect(result).toEqual({ count: 0 });
    });

    it("should propagate database errors", async () => {
      db.member.updateMany.mockRejectedValue(new Error("db down"));

      await expect(service.rejectMemberAssignment("m-1", 1)).rejects.toThrow(
        "db down"
      );
    });
  });

  // =====================================================================
  // MEMBERS BY STATUS
  // =====================================================================
  describe("getMembersByStatus", () => {
    it.each(["PENDING", "ASSIGNED", "UNASSIGNED"] as const)(
      "should filter by gymId and status %s",
      async (status) => {
        const members = [
          {
            publicId: "m-1",
            name: "John",
            surname: "Doe",
            email: "john@test.com",
            assignmentStatus: status,
            trainer: null,
          },
        ];
        db.member.findMany.mockResolvedValue(members);

        const result = await service.getMembersByStatus(1, status);

        expect(db.member.findMany).toHaveBeenCalledWith({
          where: { gymId: 1, assignmentStatus: status },
          select: {
            publicId: true,
            name: true,
            surname: true,
            email: true,
            assignmentStatus: true,
            trainer: { select: { name: true, surname: true } },
          },
        });
        expect(result).toEqual(members);
        expect(logger.info).toHaveBeenCalledWith(
          expect.stringContaining(`status ${status}`)
        );
      }
    );

    it("should return an empty array when nobody has that status", async () => {
      db.member.findMany.mockResolvedValue([]);

      await expect(service.getMembersByStatus(1, "PENDING")).resolves.toEqual(
        []
      );
    });

    it("should not select the password field", async () => {
      db.member.findMany.mockResolvedValue([]);

      await service.getMembersByStatus(1, "PENDING");

      const arg = db.member.findMany.mock.calls[0][0];
      expect(arg.select).not.toHaveProperty("password");
    });
  });
});