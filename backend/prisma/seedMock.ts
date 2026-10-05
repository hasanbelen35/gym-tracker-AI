/*import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CONSTANTS
const GYM_ID = 1;
const MOCK_EMAIL_PREFIX = "mock.";
const MOCK_PASSWORD = "$2b$10$mockmockmockmockmockmuQ3m1k5y9Zr6mX7vLq0o8d2nJ4uTq1e";

const FIRST_NAMES = [
    "Ahmet", "Mehmet", "Ayşe", "Fatma", "Mustafa", "Zeynep", "Emre", "Elif",
    "Burak", "Selin", "Can", "Deniz", "Merve", "Kerem", "Ece", "Onur",
    "Büşra", "Cem", "Derya", "Berk", "Gizem", "Tolga", "Ceren", "Oğuz",
];

const LAST_NAMES = [
    "Yılmaz", "Kaya", "Demir", "Şahin", "Çelik", "Yıldız", "Aydın", "Özdemir",
    "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara", "Koç", "Kurt",
];

// TYPES
type MockProfile = {
    key: string;
    memberCount: number;
    visitDaysAgo: () => number[];
};

// HELPERS
const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

// BUILD A DATE N DAYS AGO WITH A RANDOM GYM HOUR (NEVER IN THE FUTURE)
const buildDate = (daysAgo: number) => {
    const now = new Date();
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(randomInt(7, 21), randomInt(0, 59), 0, 0);
    if (date.getTime() > now.getTime()) {
        return new Date(now.getTime() - 60 * 60 * 1000);
    }
    return date;
};

// GENERATE A REGULAR VISIT SCHEDULE: START, START+STEP, START+2*STEP ...
const buildSchedule = (start: number, step: number, count: number) =>
    Array.from({ length: count }, (_, i) => start + i * step);

// MOCK PROFILES (EACH ONE TARGETS A SPECIFIC RISK RULE)
const PROFILES: MockProfile[] = [
    // REGULAR: COMES EVERY 2 DAYS, LAST VISIT TODAY OR YESTERDAY
    { key: "regular-daily", memberCount: 6, visitDaysAgo: () => buildSchedule(randomInt(0, 1), 2, 15) },
    // REGULAR: COMES EVERY 4 DAYS, LAST VISIT 1-3 DAYS AGO
    { key: "regular-weekly", memberCount: 6, visitDaysAgo: () => buildSchedule(randomInt(1, 3), 4, 8) },
    // AT RISK: USED TO COME EVERY 2 DAYS BUT ABSENT FOR 7-8 DAYS (ABSENCE_ABOVE_USUAL_PATTERN)
    { key: "absence-pattern", memberCount: 4, visitDaysAgo: () => buildSchedule(randomInt(7, 8), 2, 14) },
    // AT RISK: STILL COMING BUT FREQUENCY DROPPED (VISIT_FREQUENCY_DROPPED)
    { key: "frequency-drop", memberCount: 4, visitDaysAgo: () => [2, 9, 15, 17, 19, 21, 23, 25] },
    // AT RISK: NO VISIT FOR 12-25 DAYS (NO_VISIT_10_PLUS)
    { key: "inactive-10plus", memberCount: 4, visitDaysAgo: () => buildSchedule(randomInt(12, 25), 3, 8) },
    // GHOST: NO VISIT FOR 35-60 DAYS (NO_VISIT_30_PLUS)
    { key: "ghost", memberCount: 4, visitDaysAgo: () => buildSchedule(randomInt(35, 60), 3, 10) },
];

// NEVER VISITED PROFILES (NO SESSIONS, ONLY REGISTER DATE MATTERS)
const NEVER_VISITED_PROFILES = [
    // NEW MEMBER GRACE PERIOD (NEW_MEMBER)
    { key: "never-new", memberCount: 2, createdDaysAgo: () => randomInt(1, 10) },
    // AT RISK: REGISTERED 15-29 DAYS AGO, NEVER CAME (NEVER_VISITED)
    { key: "never-risk", memberCount: 2, createdDaysAgo: () => randomInt(16, 28) },
    // GHOST: REGISTERED 40+ DAYS AGO, NEVER CAME (NEVER_VISITED)
    { key: "never-ghost", memberCount: 2, createdDaysAgo: () => randomInt(40, 90) },
];

// BUILD SESSION OBJECTS FROM DAYS AGO LIST
const buildSessions = (daysAgoList: number[]) =>
    daysAgoList.map((daysAgo) => {
        const checkIn = buildDate(daysAgo);
        const duration = randomInt(40, 100);
        const checkOut = new Date(checkIn.getTime() + duration * 60 * 1000);
        return {
            gymId: GYM_ID,
            checkIn,
            checkOut: checkOut.getTime() > Date.now() ? null : checkOut,
            duration: checkOut.getTime() > Date.now() ? null : duration,
        };
    });

let nameCounter = 0;
const nextName = () => {
    const name = FIRST_NAMES[nameCounter % FIRST_NAMES.length];
    const surname = LAST_NAMES[(nameCounter * 3 + 1) % LAST_NAMES.length];
    nameCounter++;
    return { name, surname };
};

async function main() {
    // CHECK GYM EXISTS
    const gym = await prisma.gym.findUnique({ where: { id: GYM_ID } });
    if (!gym) {
        throw new Error(`Gym with id ${GYM_ID} not found.`);
    }

    // CLEAN OLD MOCK DATA (SESSIONS FIRST BECAUSE OF FOREIGN KEY)
    await prisma.session.deleteMany({
        where: { member: { email: { startsWith: MOCK_EMAIL_PREFIX } } },
    });
    await prisma.member.deleteMany({
        where: { email: { startsWith: MOCK_EMAIL_PREFIX } },
    });

    // CREATE MEMBERS WITH SESSIONS
    for (const profile of PROFILES) {
        for (let i = 1; i <= profile.memberCount; i++) {
            const { name, surname } = nextName();
            const daysAgoList = profile.visitDaysAgo();
            const oldestVisit = Math.max(...daysAgoList);

            await prisma.member.create({
                data: {
                    gymId: GYM_ID,
                    name,
                    surname,
                    email: `${MOCK_EMAIL_PREFIX}${profile.key}.${i}@test.com`,
                    password: MOCK_PASSWORD,
                    age: randomInt(18, 50),
                    height: randomInt(155, 195),
                    weight: randomInt(50, 110),
                    createdAt: buildDate(oldestVisit + randomInt(5, 30)),
                    sessions: { create: buildSessions(daysAgoList) },
                },
            });
        }
        console.log(`CREATED PROFILE: ${profile.key} (${profile.memberCount})`);
    }

    // CREATE MEMBERS WITHOUT SESSIONS
    for (const profile of NEVER_VISITED_PROFILES) {
        for (let i = 1; i <= profile.memberCount; i++) {
            const { name, surname } = nextName();

            await prisma.member.create({
                data: {
                    gymId: GYM_ID,
                    name,
                    surname,
                    email: `${MOCK_EMAIL_PREFIX}${profile.key}.${i}@test.com`,
                    password: MOCK_PASSWORD,
                    age: randomInt(18, 50),
                    height: randomInt(155, 195),
                    weight: randomInt(50, 110),
                    createdAt: buildDate(profile.createdDaysAgo()),
                },
            });
        }
        console.log(`CREATED PROFILE: ${profile.key} (${profile.memberCount})`);
    }

    // CLEAR OLD RISK CACHE SO NEXT REQUEST CALCULATES FRESH DATA
    await prisma.gymRiskAnalyticsCache.deleteMany({ where: { gymId: GYM_ID } });

    console.log("MOCK DATA SEEDING COMPLETED.");
}

main()
    .catch((error) => {
        console.error("SEED ERROR:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
    
    */