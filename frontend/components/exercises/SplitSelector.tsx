'use client';

import React from "react";

export type ProgramTypeEnum = "WORKOUT" | "DIET";
export type SplitCategoryEnum = "PPL" | "UPPER_LOWER" | "FULL_BODY" | "BRO_SPLIT" | "CUSTOM";

interface SplitSelectorProps {
  title: string;
  setTitle: (value: string) => void;
  programType: ProgramTypeEnum;
  setProgramType: (value: ProgramTypeEnum) => void;
  splitType: SplitCategoryEnum;
  setSplitType: (value: SplitCategoryEnum) => void;
  onNext: () => void;
}

const SPLIT_OPTIONS: { label: string; value: SplitCategoryEnum; description: string }[] = [
  { label: "Push / Pull / Legs (PPL)", value: "PPL", description: "İtme, çekme ve bacak kaslarını ayıran popüler rutin." },
  { label: "Upper / Lower", value: "UPPER_LOWER", description: "Üst vücut ve alt vücut antrenmanlarını dengeleyen sistem." },
  { label: "Full Body", value: "FULL_BODY", description: "Tüm vücut kas gruplarının tek günde çalıştırıldığı sistem." },
  { label: "Bro Split", value: "BRO_SPLIT", description: "Her gün tek bir büyük kas grubuna odaklanan klasik rutin." },
  { label: "Custom", value: "CUSTOM", description: "Tamamen kişiselleştirilmiş özel antrenman programı." },
];

export const SplitSelector: React.FC<SplitSelectorProps> = ({
  title,
  setTitle,
  programType,
  setProgramType,
  splitType,
  setSplitType,
  onNext,
}) => {
  const handleNextClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Lütfen bir program ismi girin.");
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleNextClick} className="space-y-6 bg-nav-bg border border-nav-border rounded-2xl p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">1. Adım: Program Detayları & Split</h2>
        <p className="text-xs text-foreground opacity-70">
          Programın genel adını belirleyin ve antrenman sistemini seçin.
        </p>
      </div>

      {/* Program Title Input */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-foreground opacity-80">
          Program Başlığı / İsmi
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Örn: Ahmet Yaz Dönemi Ağır PPL"
          className="w-full px-4 py-3 rounded-xl bg-background border border-nav-border text-sm text-foreground focus:outline-none focus:border-brand-500 transition-all"
          required
        />
      </div>

      {/* Program Type Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-foreground opacity-80">
          Program Kategorisi
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setProgramType("WORKOUT")}
            className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
              programType === "WORKOUT"
                ? "bg-brand-500 text-white border-brand-500 shadow-md"
                : "bg-background text-foreground border-nav-border hover:border-brand-500"
            }`}
          >
            Antrenman (Workout)
          </button>
          <button
            type="button"
            onClick={() => setProgramType("DIET")}
            className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
              programType === "DIET"
                ? "bg-brand-500 text-white border-brand-500 shadow-md"
                : "bg-background text-foreground border-nav-border hover:border-brand-500"
            }`}
          >
            Beslenme (Diet)
          </button>
        </div>
      </div>

      {/* Split Category Options */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-foreground opacity-80">
          Antrenman Split Sistemi
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SPLIT_OPTIONS.map((option) => {
            const isSelected = splitType === option.value;
            return (
              <div
                key={option.value}
                onClick={() => setSplitType(option.value)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-brand-500/10 border-brand-500 text-foreground"
                    : "bg-background border-nav-border hover:border-brand-500 opacity-80 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{option.label}</span>
                    <input
                      type="radio"
                      name="splitType"
                      checked={isSelected}
                      onChange={() => setSplitType(option.value)}
                      className="accent-brand-500"
                    />
                  </div>
                  <p className="text-xs opacity-70">{option.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit / Next Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md"
        >
          Sonraki Adım (Günler & Egzersizler) &rarr;
        </button>
      </div>
    </form>
  );
};