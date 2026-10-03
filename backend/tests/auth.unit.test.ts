import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../src/lib/db";
import { logger } from "../src/config/logger";
import { AuthService } from "../src/services/auth.service";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../src/lib/db", () => ({
  __esModule: true,
  default: {
    gym: { findUnique: jest.fn(), create: jest.fn() },
    member: { findUnique: jest.fn(), create: jest.fn() },
    trainer: { findUnique: jest.fn(), create: jest.fn() },
  },
}));
jest.mock("../src/config/logger", () => ({
  logger: { info: jest.fn(), warn: jest.fn() },
}));

// ---------------------------------------------------------------------
// Typed mock helpers
// ---------------------------------------------------------------------
const db = prisma as unknown as {
  gym: { findUnique: jest.Mock; create: jest.Mock };
  member: { findUnique: jest.Mock; create: jest.Mock };
  trainer: { findUnique: jest.Mock; create: jest.Mock };
};
const hashMock = bcrypt.hash as jest.Mock;
const compareMock = bcrypt.compare as jest.Mock;
const signMock = jwt.sign as jest.Mock;

type Table = "gym" | "member" | "trainer";

/** Email is not used by any of the three tables. */
const mockEmailFree = () => {
  db.gym.findUnique.mockResolvedValue(null);
  db.member.findUnique.mockResolvedValue(null);
  db.trainer.findUnique.mockResolvedValue(null);
};

/** Email is already used in exactly one table. */
const mockEmailTakenIn = (table: Table) => {
  mockEmailFree();
  db[table].findUnique.mockResolvedValue({ id: 99, email: "taken@test.com" });
};

describe("AuthService", () => {
  let authService: AuthService;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret-key";
  });

  beforeEach(() => {
    // resetAllMocks also clears mockResolvedValue implementations,
    // so no behaviour leaks from one test to the next.
    jest.resetAllMocks();
    authService = new AuthService();
  });

  // =====================================================================
  // GLOBAL EMAIL UNIQUENESS (private isEmailTaken, tested via register*)
  // =====================================================================
  describe("Global email uniqueness", () => {
    const registerCalls: Record<
      Table,
      { run: () => Promise<unknown>; create: () => jest.Mock }
    > = {
      gym: {
        run: () =>
          authService.registerGym({
            name: "Gym",
            email: "taken@test.com",
            password: "pw",
          }),
        create: () => db.gym.create,
      },
      member: {
        run: () =>
          authService.registerMember({
            name: "John",
            surname: "Doe",
            email: "taken@test.com",
            password: "pw",
            gymId: 1,
          }),
        create: () => db.member.create,
      },
      trainer: {
        run: () =>
          authService.registerTrainer({
            name: "Jane",
            surname: "Smith",
            email: "taken@test.com",
            password: "pw",
            gymId: 1,
          }),
        create: () => db.trainer.create,
      },
    };

    const registerTargets: Table[] = ["gym", "member", "trainer"];
    const takenIn: Table[] = ["gym", "member", "trainer"];

    describe.each(registerTargets)("register %s", (target) => {
      it.each(takenIn)(
        `should reject when the email already exists in the %s table`,
        async (existingTable) => {
          mockEmailTakenIn(existingTable);

          await expect(registerCalls[target].run()).rejects.toThrow(
            "Email already exists"
          );

          expect(registerCalls[target].create()).not.toHaveBeenCalled();
          expect(hashMock).not.toHaveBeenCalled();
          expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining("taken@test.com")
          );
        }
      );
    });

    it("should check all three tables with the given email", async () => {
      mockEmailFree();
      hashMock.mockResolvedValue("hashed");
      db.gym.create.mockResolvedValue({ id: 1, name: "G", email: "a@b.com" });

      await authService.registerGym({
        name: "G",
        email: "a@b.com",
        password: "pw",
      });

      expect(db.gym.findUnique).toHaveBeenCalledWith({
        where: { email: "a@b.com" },
      });
      expect(db.member.findUnique).toHaveBeenCalledWith({
        where: { email: "a@b.com" },
      });
      expect(db.trainer.findUnique).toHaveBeenCalledWith({
        where: { email: "a@b.com" },
      });
    });
  });

  // =====================================================================
  // GYM
  // =====================================================================
  describe("Gym Authentication", () => {
    const mockGymData = {
      name: "Test Gym",
      email: "gym@test.com",
      password: "password123",
    };

    describe("registerGym", () => {
      it("should register a gym, hash the password and return no password", async () => {
        mockEmailFree();
        hashMock.mockResolvedValue("hashedPassword123");
        db.gym.create.mockResolvedValue({
          id: 1,
          name: "Test Gym",
          email: "gym@test.com",
          password: "hashedPassword123",
        });

        const result = await authService.registerGym(mockGymData);

        expect(hashMock).toHaveBeenCalledWith("password123", 10);
        expect(db.gym.create).toHaveBeenCalledWith({
          data: { ...mockGymData, password: "hashedPassword123" },
        });
        expect(result).toEqual({
          gym: { id: 1, name: "Test Gym", email: "gym@test.com" },
        });
        expect(result.gym).not.toHaveProperty("password");
        expect(logger.info).toHaveBeenCalled();
      });

      it("should pass optional address and phone to prisma", async () => {
        mockEmailFree();
        hashMock.mockResolvedValue("hashedPassword123");
        db.gym.create.mockResolvedValue({
          id: 2,
          name: "Test Gym",
          email: "gym@test.com",
        });

        await authService.registerGym({
          ...mockGymData,
          address: "Main St 1",
          phone: "555-0100",
        });

        expect(db.gym.create).toHaveBeenCalledWith({
          data: {
            ...mockGymData,
            address: "Main St 1",
            phone: "555-0100",
            password: "hashedPassword123",
          },
        });
      });

      it("should propagate hashing errors and not create the gym", async () => {
        mockEmailFree();
        hashMock.mockRejectedValue(new Error("hash failed"));

        await expect(authService.registerGym(mockGymData)).rejects.toThrow(
          "hash failed"
        );
        expect(db.gym.create).not.toHaveBeenCalled();
      });
    });

    describe("loginGym", () => {
      const storedGym = {
        id: 1,
        name: "Test Gym",
        email: "gym@test.com",
        password: "hashedPassword123",
      };

      it("should login with correct credentials and sign a correct JWT", async () => {
        db.gym.findUnique.mockResolvedValue(storedGym);
        compareMock.mockResolvedValue(true);
        signMock.mockReturnValue("fake-jwt-token");

        const result = await authService.loginGym({
          email: "gym@test.com",
          password: "password123",
        });

        expect(db.gym.findUnique).toHaveBeenCalledWith({
          where: { email: "gym@test.com" },
        });
        expect(compareMock).toHaveBeenCalledWith(
          "password123",
          "hashedPassword123"
        );
        expect(signMock).toHaveBeenCalledWith(
          { id: 1, role: "gym", name: "Test Gym" },
          "test-secret-key",
          { expiresIn: "7d" }
        );
        expect(result).toEqual({
          token: "fake-jwt-token",
          gym: { id: 1, name: "Test Gym", email: "gym@test.com" },
        });
        expect(result.gym).not.toHaveProperty("password");
      });

      it("should throw if gym is not found", async () => {
        db.gym.findUnique.mockResolvedValue(null);

        await expect(
          authService.loginGym({ email: "notfound@test.com", password: "123" })
        ).rejects.toThrow("Gym not found");

        expect(compareMock).not.toHaveBeenCalled();
        expect(signMock).not.toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("notfound@test.com")
        );
      });

      it("should throw if password is wrong", async () => {
        db.gym.findUnique.mockResolvedValue(storedGym);
        compareMock.mockResolvedValue(false);

        await expect(
          authService.loginGym({ email: "gym@test.com", password: "wrong" })
        ).rejects.toThrow("Invalid password");

        expect(signMock).not.toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("gym@test.com")
        );
      });
    });
  });

  // =====================================================================
  // MEMBER
  // =====================================================================
  describe("Member Authentication", () => {
    const mockMemberData = {
      name: "John",
      surname: "Doe",
      email: "member@test.com",
      password: "password123",
      gymId: 1,
    };

    describe("registerMember", () => {
      it("should register a member, hash the password and return no password", async () => {
        mockEmailFree();
        hashMock.mockResolvedValue("hashedPassword123");
        db.member.create.mockResolvedValue({
          id: 1,
          name: "John",
          surname: "Doe",
          email: "member@test.com",
          password: "hashedPassword123",
        });

        const result = await authService.registerMember(mockMemberData);

        expect(hashMock).toHaveBeenCalledWith("password123", 10);
        expect(db.member.create).toHaveBeenCalledWith({
          data: { ...mockMemberData, password: "hashedPassword123" },
        });
        expect(result).toEqual({
          member: { id: 1, name: "John", email: "member@test.com" },
        });
        expect(result.member).not.toHaveProperty("password");
      });

      it("should propagate hashing errors and not create the member", async () => {
        mockEmailFree();
        hashMock.mockRejectedValue(new Error("hash failed"));

        await expect(
          authService.registerMember(mockMemberData)
        ).rejects.toThrow("hash failed");
        expect(db.member.create).not.toHaveBeenCalled();
      });
    });

    describe("loginMember", () => {
      const storedMember = {
        id: 1,
        name: "John",
        surname: "Doe",
        password: "hashedPassword123",
        email: "member@test.com",
        gymId: 1,
        isProfileCompleted: true,
        gym: { name: "Test Gym" },
      };

      it("should login, sign a correct JWT and return the member with gym name", async () => {
        db.member.findUnique.mockResolvedValue(storedMember);
        compareMock.mockResolvedValue(true);
        signMock.mockReturnValue("fake-jwt-token");

        const result = await authService.loginMember({
          email: "member@test.com",
          password: "password123",
        });

        expect(db.member.findUnique).toHaveBeenCalledWith(
          expect.objectContaining({ where: { email: "member@test.com" } })
        );
        expect(compareMock).toHaveBeenCalledWith(
          "password123",
          "hashedPassword123"
        );
        expect(signMock).toHaveBeenCalledWith(
          {
            id: 1,
            gymId: 1,
            gymName: "Test Gym",
            role: "member",
            name: "John",
            surname: "Doe",
            isProfileCompleted: true,
          },
          "test-secret-key",
          { expiresIn: "7d" }
        );
        expect(result).toEqual({
          token: "fake-jwt-token",
          member: {
            id: 1,
            name: "John",
            email: "member@test.com",
            gymId: 1,
            gymName: "Test Gym",
            isProfileCompleted: true,
          },
        });
        expect(result.member).not.toHaveProperty("password");
      });

      it("should reflect isProfileCompleted = false", async () => {
        db.member.findUnique.mockResolvedValue({
          ...storedMember,
          isProfileCompleted: false,
        });
        compareMock.mockResolvedValue(true);
        signMock.mockReturnValue("fake-jwt-token");

        const result = await authService.loginMember({
          email: "member@test.com",
          password: "password123",
        });

        expect(result.member.isProfileCompleted).toBe(false);
        expect(signMock).toHaveBeenCalledWith(
          expect.objectContaining({ isProfileCompleted: false }),
          expect.anything(),
          expect.anything()
        );
      });

      it("should handle a member without a gym relation", async () => {
        db.member.findUnique.mockResolvedValue({ ...storedMember, gym: null });
        compareMock.mockResolvedValue(true);
        signMock.mockReturnValue("fake-jwt-token");

        const result = await authService.loginMember({
          email: "member@test.com",
          password: "password123",
        });

        expect(result.member.gymName).toBeUndefined();
      });

      it("should throw if member is not found", async () => {
        db.member.findUnique.mockResolvedValue(null);

        await expect(
          authService.loginMember({ email: "nobody@test.com", password: "x" })
        ).rejects.toThrow("Member not found");

        expect(compareMock).not.toHaveBeenCalled();
        expect(signMock).not.toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("nobody@test.com")
        );
      });

      it("should throw if password is wrong", async () => {
        db.member.findUnique.mockResolvedValue(storedMember);
        compareMock.mockResolvedValue(false);

        await expect(
          authService.loginMember({
            email: "member@test.com",
            password: "wrong",
          })
        ).rejects.toThrow("Invalid password");

        expect(signMock).not.toHaveBeenCalled();
      });
    });
  });

  // =====================================================================
  // TRAINER
  // =====================================================================
  describe("Trainer Authentication", () => {
    const mockTrainerData = {
      name: "Jane",
      surname: "Smith",
      email: "trainer@test.com",
      password: "password123",
      gymId: 1,
    };

    describe("registerTrainer", () => {
      it("should register a trainer, hash the password and return no password", async () => {
        mockEmailFree();
        hashMock.mockResolvedValue("hashedPassword123");
        db.trainer.create.mockResolvedValue({
          id: 1,
          name: "Jane",
          surname: "Smith",
          email: "trainer@test.com",
          password: "hashedPassword123",
        });

        const result = await authService.registerTrainer(mockTrainerData);

        expect(hashMock).toHaveBeenCalledWith("password123", 10);
        expect(db.trainer.create).toHaveBeenCalledWith({
          data: { ...mockTrainerData, password: "hashedPassword123" },
        });
        expect(result).toEqual({
          trainer: { id: 1, name: "Jane", email: "trainer@test.com" },
        });
        expect(result.trainer).not.toHaveProperty("password");
      });

      it("should propagate hashing errors and not create the trainer", async () => {
        mockEmailFree();
        hashMock.mockRejectedValue(new Error("hash failed"));

        await expect(
          authService.registerTrainer(mockTrainerData)
        ).rejects.toThrow("hash failed");
        expect(db.trainer.create).not.toHaveBeenCalled();
      });
    });

    describe("loginTrainer", () => {
      const storedTrainer = {
        id: 1,
        name: "Jane",
        surname: "Smith",
        password: "hashedPassword123",
        email: "trainer@test.com",
        gymId: 1,
        isProfileCompleted: false,
        gym: { name: "Test Gym", publicId: "gym-pub-123" },
      };

      it("should login, sign a correct JWT and return the trainer with gym name", async () => {
        db.trainer.findUnique.mockResolvedValue(storedTrainer);
        compareMock.mockResolvedValue(true);
        signMock.mockReturnValue("fake-jwt-token");

        const result = await authService.loginTrainer({
          email: "trainer@test.com",
          password: "password123",
        });

        expect(db.trainer.findUnique).toHaveBeenCalledWith(
          expect.objectContaining({ where: { email: "trainer@test.com" } })
        );
        expect(compareMock).toHaveBeenCalledWith(
          "password123",
          "hashedPassword123"
        );
        expect(signMock).toHaveBeenCalledWith(
          {
            id: 1,
            gymId: 1,
            gymPublicId: "gym-pub-123",
            gymName: "Test Gym",
            role: "trainer",
            name: "Jane",
            surname: "Smith",
            isProfileCompleted: false,
          },
          "test-secret-key",
          { expiresIn: "7d" }
        );
        expect(result).toEqual({
          token: "fake-jwt-token",
          trainer: {
            id: 1,
            name: "Jane",
            email: "trainer@test.com",
            gymId: 1,
            gymName: "Test Gym",
            isProfileCompleted: false,
          },
        });
        expect(result.trainer).not.toHaveProperty("password");
      });

      it("should reflect isProfileCompleted = true", async () => {
        db.trainer.findUnique.mockResolvedValue({
          ...storedTrainer,
          isProfileCompleted: true,
        });
        compareMock.mockResolvedValue(true);
        signMock.mockReturnValue("fake-jwt-token");

        const result = await authService.loginTrainer({
          email: "trainer@test.com",
          password: "password123",
        });

        expect(result.trainer.isProfileCompleted).toBe(true);
      });

      it("should handle a trainer without a gym relation", async () => {
        db.trainer.findUnique.mockResolvedValue({
          ...storedTrainer,
          gym: null,
        });
        compareMock.mockResolvedValue(true);
        signMock.mockReturnValue("fake-jwt-token");

        const result = await authService.loginTrainer({
          email: "trainer@test.com",
          password: "password123",
        });

        expect(result.trainer.gymName).toBeUndefined();
        expect(signMock).toHaveBeenCalledWith(
          expect.objectContaining({
            gymPublicId: undefined,
            gymName: undefined,
          }),
          expect.anything(),
          expect.anything()
        );
      });

      it("should throw if trainer is not found", async () => {
        db.trainer.findUnique.mockResolvedValue(null);

        await expect(
          authService.loginTrainer({ email: "nobody@test.com", password: "x" })
        ).rejects.toThrow("Trainer not found");

        expect(compareMock).not.toHaveBeenCalled();
        expect(signMock).not.toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("nobody@test.com")
        );
      });

      it("should throw if password is wrong", async () => {
        db.trainer.findUnique.mockResolvedValue(storedTrainer);
        compareMock.mockResolvedValue(false);

        await expect(
          authService.loginTrainer({
            email: "trainer@test.com",
            password: "wrong",
          })
        ).rejects.toThrow("Invalid password");

        expect(signMock).not.toHaveBeenCalled();
      });
    });
  });
});