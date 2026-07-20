import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/";

async function main() {
  const filePath = path.join(__dirname, 'exercises.json');
  
  if (!fs.existsSync(filePath)) {
    console.error("exercises.json dosyası prisma klasöründe bulunamadı!");
    return;
  }

  console.log("JSON dosyası okunuyor, lütfen bekleyin...");
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const exercises = JSON.parse(fileData);

  console.log(`Toplam egzersiz kaydı: ${exercises.length}. Veritabanına aktarılıyor...`);

  let count = 0;
  for (const ex of exercises) {
    // just turkısh datas
    const turkishInstruction = ex.instructions?.tr || null;
    const turkishSteps = ex.instruction_steps?.tr || null;

    if (!turkishInstruction) continue; 
// raw gif url creating
    const fullGifUrl = ex.gif_url ? `${GITHUB_RAW_BASE}${ex.gif_url}` : null;

    const existing = await prisma.exercise.findFirst({
      where: { name: ex.name }
    });

    if (!existing) {
      await prisma.exercise.create({
        data: {
          name: ex.name,
          category: ex.category || null,
          bodyPart: ex.body_part || null,
          equipment: ex.equipment || null,
          targetMuscle: ex.target || null,
          instructions: turkishInstruction,
          instruction_steps: turkishSteps, 
          gifUrl: fullGifUrl,
        },
      });
      count++;
    }
  }

  console.log(`Başarıyla ${count} adet Türkçe egzersiz veritabanına aktarıldı!`);
}

main()
  .catch((e) => {
    console.error("Aktarım hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });   