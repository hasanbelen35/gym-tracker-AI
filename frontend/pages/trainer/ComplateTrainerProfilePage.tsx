'use client'
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { completeTrainerProfile } from "@/store/slices/trainerSlice";
import { ArrowLeftIcon } from "@/icons/icon";
import { useRouter } from "next/navigation";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { SuccessBox } from "@/components/ui/SuccessBox";

type Gender = "MALE" | "FEMALE" | "OTHER";

interface TrainerProfileFormData {
  phone: string;
  age: string;
  height: string;
  weight: string;
  gender: Gender;
  avatarUrl: string;
}

interface TrainerProfilePayload {
  phone?: string;
  age?: number;
  height?: number;
  weight?: number;
  gender?: Gender;
  avatarUrl?: string;
}

type FieldConfig =
  | {
      name: keyof Omit<TrainerProfileFormData, "gender">;
      label: string;
      type: "text" | "number";
      placeholder?: string;
      step?: string;
      span: "full" | "third";
    }
  | {
      name: "gender";
      label: string;
      type: "select";
      options: { value: Gender; label: string }[];
      span: "full" | "third";
    };

const FIELDS: FieldConfig[] = [
  { name: "phone", label: "Telefon", type: "text", placeholder: "5XXXXXXXXX", span: "full" },
  { name: "age", label: "Yaş", type: "number", placeholder: "28", span: "third" },
  { name: "height", label: "Boy (cm)", type: "number", step: "0.01", placeholder: "180", span: "third" },
  { name: "weight", label: "Kilo (kg)", type: "number", step: "0.01", placeholder: "80", span: "third" },
  {
    name: "gender",
    label: "Cinsiyet",
    type: "select",
    span: "full",
    options: [
      { value: "MALE", label: "Erkek" },
      { value: "FEMALE", label: "Kadın" },
      { value: "OTHER", label: "Diğer" },
    ],
  },
  { name: "avatarUrl", label: "Avatar URL", type: "text", placeholder: "https://example.com/avatar.jpg", span: "full" },
];

const NUMERIC_FIELDS = new Set<keyof TrainerProfileFormData>(["age", "height", "weight"]);

const INITIAL_FORM_DATA: TrainerProfileFormData = {
  phone: "",
  age: "",
  height: "",
  weight: "",
  gender: "MALE",
  avatarUrl: "",
};

const inputClass =
  "w-full bg-background border border-nav-border rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground placeholder:opacity-40 focus:outline-none focus:border-brand-500 transition-all";

function buildPayload(formData: TrainerProfileFormData): TrainerProfilePayload {
  const payload: TrainerProfilePayload = {};

  (Object.keys(formData) as (keyof TrainerProfileFormData)[]).forEach((key) => {
    const value = formData[key].toString().trim();
    if (value === "") return;

    if (NUMERIC_FIELDS.has(key)) {
      payload[key] = Number(value) as never;
    } else {
      payload[key] = value as never;
    }
  });

  return payload;
}

const ComplateTrainerProfilePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.trainer);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<TrainerProfileFormData>(INITIAL_FORM_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    const payload = buildPayload(formData);
    const resultAction = await dispatch(completeTrainerProfile(payload));

    if (completeTrainerProfile.fulfilled.match(resultAction)) {
      setSuccessMessage("Profiliniz başarıyla güncellendi.");
    }
    router.push("/dashboard/trainer");
  };

  const renderField = (field: FieldConfig) => (
    <div key={field.name} className="space-y-1.5">
      <label className="text-xs font-medium opacity-70">{field.label}</label>
      {field.type === "select" ? (
        <select name={field.name} value={formData[field.name]} onChange={handleChange} className={inputClass}>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          step={field.type === "number" ? field.step : undefined}
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          placeholder={field.placeholder}
          className={inputClass}
        />
      )}
    </div>
  );

  const topField = FIELDS[0];
  const thirdWidthFields = FIELDS.filter((f) => f.span === "third");
  const bottomFields = FIELDS.filter((f) => f.span === "full").slice(1);

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-6 sm:p-10 transition-colors duration-200">
      <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-nav-bg border border-nav-border text-sm font-medium text-foreground/80 hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeftIcon /> Geri Dön
          </button>
        </div>

        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 sm:p-8 shadow-nav backdrop-blur-md">
          <div className="mb-6 pb-4 border-b border-nav-border">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profilini Tamamla</h1>
            <p className="text-sm opacity-70 mt-1">Üyelerinle daha iyi çalışabilmemiz için lütfen bilgilerini gir.</p>
          </div>

          <div className="mb-6 space-y-3">
            <ErrorBox message={error} />
            <SuccessBox message={successMessage} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {renderField(topField)}

            <div className="grid grid-cols-3 gap-4">
              {thirdWidthFields.map(renderField)}
            </div>

            {bottomFields.map(renderField)}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Kaydediliyor..." : "Profili Güncelle"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/dashboard/trainer")}
                className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors bg-transparent border-none cursor-pointer"
              >
                Daha sonra güncelle
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplateTrainerProfilePage;