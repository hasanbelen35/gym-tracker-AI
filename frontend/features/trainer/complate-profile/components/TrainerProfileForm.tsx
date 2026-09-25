import React from "react";
import { FieldConfig, TrainerProfileFormData } from "../types";
import { FIELDS, inputClass } from "../config/formConfig";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { SuccessBox } from "@/components/ui/SuccessBox";

interface TrainerProfileFormProps {
    formData: TrainerProfileFormData;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onSkip: () => void;
}

export const TrainerProfileForm: React.FC<TrainerProfileFormProps> = ({
    formData,
    loading,
    error,
    successMessage,
    onChange,
    onSubmit,
    onSkip,
}) => {
    const renderField = (field: FieldConfig) => (
        <div key={field.name} className="space-y-1.5">
            <label className="text-xs font-medium opacity-70">{field.label}</label>
            {field.type === "select" ? (
                <select name={field.name} value={formData[field.name]} onChange={onChange} className={inputClass}>
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
                    onChange={onChange}
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
        <div className="bg-nav-bg border border-nav-border rounded-2xl p-6 sm:p-8 shadow-nav backdrop-blur-md">
            <div className="mb-6 pb-4 border-b border-nav-border">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profilini Tamamla</h1>
                <p className="text-sm opacity-70 mt-1">Üyelerinle daha iyi çalışabilmemiz için lütfen bilgilerini gir.</p>
            </div>

            <div className="mb-6 space-y-3">
                <ErrorBox message={error} />
                <SuccessBox message={successMessage} />
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
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
                        onClick={onSkip}
                        className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors bg-transparent border-none cursor-pointer"
                    >
                        Daha sonra güncelle
                    </button>
                </div>
            </form>
        </div>
    );
};