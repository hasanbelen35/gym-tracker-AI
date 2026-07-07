import prisma from "../lib/db";

export class SessionService {
  // Check if member has an active session, if not create a new one
  async checkIn(memberId: number, gymId: number) {
    const activeSession = await prisma.session.findFirst({
      where: { memberId, gymId, checkOut: null },
    });

    if (activeSession) throw new Error("Member already has an active session");

    const session = await prisma.session.create({
      data: { memberId, gymId },
    });

    return session;
  }

  async checkOut(memberId: number) {
    const activeSession = await prisma.session.findFirst({
      where: { memberId, checkOut: null },
    });

    if (!activeSession) throw new Error("No active session found");

    const checkOut = new Date();

    const duration = Math.round(
      (checkOut.getTime() - activeSession.checkIn.getTime()) / 1000 / 60
    );

    const session = await prisma.session.update({
      where: { id: activeSession.id },
      data: { checkOut, duration },
    });

    return session;
  }

  async getMemberSessions(memberId: number) {
    return prisma.session.findMany({
      where: { memberId },
      include: { gym: { select: { name: true } } },
      orderBy: { checkIn: "desc" },
    });
  }

  // Get all sessions for a specific gym including member name and surname
  async getGymSessions(gymId: number) {
    const sessions = await prisma.session.findMany({
      where: { gymId },
      include: {
        member: { select: { name: true, surname: true } }
      },
      orderBy: { checkIn: 'desc' }
    });

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
    const sessions = await prisma.session.findMany({
      where: { gymId, checkOut: null },
      include: { member: { select: { name: true, surname: true } } },
    });

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