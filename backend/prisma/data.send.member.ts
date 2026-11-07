import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const memberId = 1;
    const gymId = 1;
    const trainerId = 1; 

    console.log(" Mevcut kullanıcı (Hasan Belen) için yeni veriler ekleniyor...");

    const member = await prisma.member.findUnique({
        where: { id: memberId }
    });

    if (!member) {
        console.error("❌ Hata: ID'si 1 olan üye sistemde bulunamadı!");
        return;
    }

    console.log(` Üye doğrulandı: ${member.name} ${member.surname} (ID: ${member.id})`);

    console.log(" Yeni 50 adet ölçüm ekleniyor...");
    for (let i = 1; i <= 50; i++) {
        const measuredDate = new Date();
        measuredDate.setDate(measuredDate.getDate() - (51 - i));

        await prisma.memberMeasurement.create({
            data: {
                memberId: member.id,
                bodyFatRate: Number((17 - (i * 0.05)).toFixed(1)),
                muscleMass: Number((36 + (i * 0.04)).toFixed(1)),
                chest: 98 + (i % 5),
                waist: 82 - (i % 3),
                arm: 35 + (i * 0.02),
                hip: 94,
                shoulder: 112,
                notes: `Ekstra test ölçüm notu #${i} - Yeni eklenen seri.`,
                measuredAt: measuredDate,
            }
        });
    }

    console.log("⏱ Yeni 50 adet seans ekleniyor...");
    for (let i = 1; i <= 50; i++) {
        const checkInDate = new Date();
        checkInDate.setDate(checkInDate.getDate() - (51 - i));
        checkInDate.setHours(10, 0, 0, 0);

        const checkOutDate = new Date(checkInDate);
        checkOutDate.setMinutes(checkOutDate.getMinutes() + 70);

        await prisma.session.create({
            data: {
                memberId: member.id,
                gymId: gymId,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                duration: 70,
            }
        });
    }

    console.log(" Yeni 50 adet antrenman programı ekleniyor...");
    const programTypes = ["WORKOUT", "DIET"] as const;
    const splitTypes = ["PPL", "UPPER_LOWER", "FULL_BODY", "BRO_SPLIT", "CUSTOM"] as const;

    for (let i = 1; i <= 50; i++) {
        const randomType = programTypes[i % programTypes.length];
        const randomSplit = splitTypes[i % splitTypes.length];

        await prisma.program.create({
            data: {
                memberId: member.id,
                trainerId: trainerId, 
                title: `Ekstra ${i}. Sezon - ${randomSplit} Programı`,
                type: randomType,
                splitType: randomSplit,
                isActive: false,
            }
        });
    }

    console.log("Hasan Belen için 50'şer adet yeni veri başarıyla eklendi!");
}

main()
    .catch((e) => {
        console.error("❌ Hata oluştu:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });