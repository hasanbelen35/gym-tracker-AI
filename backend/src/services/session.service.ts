import prisma from "../lib/db";
import { logger } from "../config/logger";

export class SessionService {
  // Check if member has an active session, if not create a new one
  async checkIn(memberId: number, gymId: number) {
    logger.info(`Attempting check-in for member ID: ${memberId} in gymId: ${gymId}`);
    const activeSession = await prisma.session.findFirst({
      where: { memberId, gymId, checkOut: null },
    });

    if (activeSession) {
      logger.warn(`Check-in failed: Member ID ${memberId} already has an active session in gymId: ${gymId}`);
      throw new Error("Member already has an active session");
    }

    const session = await prisma.session.create({
      data: { memberId, gymId },
    });

    logger.info(`Successfully checked in member ID: ${memberId}, session ID: ${session.id}`);
    return session;
  }

  async checkOut(memberId: number) {
    logger.info(`Attempting check-out for member ID: ${memberId}`);
    const activeSession = await prisma.session.findFirst({
      where: { memberId, checkOut: null },
    });

    if (!activeSession) {
      logger.warn(`Check-out failed: No active session found for member ID: ${memberId}`);
      throw new Error("No active session found");
    }

    const checkOut = new Date();

    const duration = Math.round(
      (checkOut.getTime() - activeSession.checkIn.getTime()) / 1000 / 60
    );

    const session = await prisma.session.update({
      where: { id: activeSession.id },
      data: { checkOut, duration },
    });

    logger.info(`Successfully checked out member ID: ${memberId}, session ID: ${activeSession.id}, duration: ${duration} minutes`);
    return session;
  }

  async getMemberSessions(memberId: number) {
    logger.info(`Fetching all sessions for member ID: ${memberId}`);
    const sessions = await prisma.session.findMany({
      where: { memberId },
      include: { gym: { select: { name: true } } },
      orderBy: { checkIn: "desc" },
    });
    logger.info(`Successfully fetched ${sessions.length} sessions for member ID: ${memberId}`);
    return sessions;
  }

  // Get all sessions for a specific gym including member name and surname
  async getGymSessions(gymId: number) {
    logger.info(`Fetching all sessions for gymId: ${gymId}`);
    const sessions = await prisma.session.findMany({
      where: { gymId },
      include: {
        member: { select: { name: true, surname: true } }
      },
      orderBy: { checkIn: 'desc' }
    });

    logger.info(`Successfully fetched ${sessions.length} sessions for gymId: ${gymId}`);
    return sessions.map((s) => ({
      id: s.id,
      memberId: s.memberId,
      gymId: s.gymId,
      memberName: `${s.member.name} ${s.member.surname}`,
      checkIn: s.checkIn,
      checkOut: s.checkOut,
      duration: s.duration,
    }));
  }

  // Get only currently active (not checked out) sessions for a gym
  async getActiveGymSessions(gymId: number) {
    logger.info(`Fetching active gym sessions for gymId: ${gymId}`);
    const sessions = await prisma.session.findMany({
      where: { gymId, checkOut: null },
      include: { member: { select: { name: true, surname: true } } },
    });

    logger.info(`Successfully fetched ${sessions.length} active sessions for gymId: ${gymId}`);
    return sessions.map((s) => ({
      id: s.id,
      memberId: s.memberId,
      gymId: s.gymId,
      memberName: `${s.member.name} ${s.member.surname}`,
      checkIn: s.checkIn,
      checkOut: s.checkOut,
      duration: s.duration,
    }));
  }
}