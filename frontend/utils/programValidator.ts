import { ProgramDayInput } from "@/store/slices/exerciseSlice";

export function validateProgramForm(title: string, days: ProgramDayInput[]): string | null {
  if (!title || title.trim() === "") {
    return "Lütfen antrenman programı için bir başlık girin.";
  }

  if (!days || days.length === 0) {
    return "Hata: Program için en az bir gün tanımlanmalıdır.";
  }

  for (const day of days) {
    if (!day.dayName || day.dayName.trim() === "") {
      return `Hata: ${day.dayOrder}. günün ismi boş bırakılamaz.`;
    }

    if (!day.isRestDay && (!day.exercises || day.exercises.length === 0)) {
      return `Hata: "${day.dayName}" (${day.dayOrder}. gün) boş bırakılamaz. Lütfen egzersiz ekleyin ya da bu günü "Dinlenme Günü" olarak işaretleyin.`;
    }

    if (!day.isRestDay && day.exercises) {
      for (const [exIdx, ex] of day.exercises.entries()) {
        if (!ex.sets || ex.sets.length === 0) {
          return `Hata: "${day.dayName}" günündeki ${exIdx + 1}. egzersizin en az 1 seti olmalıdır.`;
        }
      }
    }
  }

  return null;
}