"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  clearError,
  registerGym,
  registerMember,
  registerTrainer,
} from "@/store/slices/authSlice";
import { fetchGymProfile } from "@/store/slices/gymSlice";
import type { Gym } from "@/types/types";

import {
  buildRegisterPayload,
  groupFieldsIntoRows,
  registerConfigs,
  type RegisterFieldConfig,
  type RegisterRole,
} from "./registerConfig";

interface RegisterFormProps {
  role: RegisterRole;
}

type RegisterMemberPayload = Parameters<typeof registerMember>[0];
type RegisterTrainerPayload = Parameters<typeof registerTrainer>[0];
type RegisterGymPayload = Parameters<typeof registerGym>[0];

export function RegisterForm({ role }: RegisterFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    profile: gyms,
    loading: gymsLoading,
  } = useAppSelector((state) => state.gym);

  const config = registerConfigs[role];

  const initialFormData = Object.fromEntries(
    config.fields.map((field) => [field.name, ""])
  );

  const [formData, setFormData] =
    useState<Record<string, string>>(initialFormData);

  useEffect(() => {
    if (
      config.requiresGymSelect &&
      (!gyms || gyms.length === 0)
    ) {
      dispatch(fetchGymProfile());
    }
  }, [dispatch, gyms, config.requiresGymSelect]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    dispatch(clearError());

    let success = false;

    switch (role) {
      case "athlete": {
        const payload =
          buildRegisterPayload<RegisterMemberPayload>(
            formData,
            registerConfigs.athlete.numericFields
          );

        success = await registerConfigs.athlete.register(
          dispatch,
          payload
        );

        break;
      }

      case "trainer": {
        const payload =
          buildRegisterPayload<RegisterTrainerPayload>(
            formData,
            registerConfigs.trainer.numericFields
          );

        success = await registerConfigs.trainer.register(
          dispatch,
          payload
        );

        break;
      }

      case "gym": {
        const payload =
          buildRegisterPayload<RegisterGymPayload>(
            formData,
            registerConfigs.gym.numericFields
          );

        success = await registerConfigs.gym.register(
          dispatch,
          payload
        );

        break;
      }
    }

    if (success) {
      router.push(config.loginPath);
    }
  };

  const inputClass =
    "w-full h-11 rounded-xl border border-nav-border bg-(--background) px-3.5 text-sm text-(--foreground) outline-none focus:border-brand-400 transition";

  const renderField = (
    field: RegisterFieldConfig
  ) => {
    if (field.type === "gymSelect") {
      return (
        <div
          key={field.name}
          className="flex-1"
        >
          <label className="block text-xs font-medium opacity-80 mb-1.5">
            {field.label}{" "}
            {field.required && (
              <span className="text-brand-text">*</span>
            )}
          </label>

          <select
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className={inputClass}
            required={field.required}
            disabled={gymsLoading}
          >
            <option value="" disabled>
              {gymsLoading
                ? "Yükleniyor..."
                : "Salon seçin"}
            </option>

            {Array.isArray(gyms) &&
              gyms.map((gym: Gym) => (
                <option
                  key={gym.id}
                  value={gym.id}
                  className="bg-(--background) text-(--foreground)"
                >
                  {gym.name}
                </option>
              ))}
          </select>
        </div>
      );
    }

    return (
      <div
        key={field.name}
        className="flex-1"
      >
        <label className="block text-xs font-medium opacity-80 mb-1.5">
          {field.label}{" "}
          {field.required && (
            <span className="text-brand-text">*</span>
          )}
        </label>

        <input
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          value={formData[field.name]}
          onChange={handleChange}
          onWheel={
            field.type === "number"
              ? (e) => e.currentTarget.blur()
              : undefined
          }
          className={inputClass}
          required={field.required}
        />
      </div>
    );
  };

  const rows = groupFieldsIntoRows(config.fields);

  return (
    <main
      className="flex min-h-screen items-center justify-center relative overflow-hidden bg-(--background) text-(--foreground) py-10 transition-colors duration-300"
      style={{
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-500" />

      <button
        type="button"
        onClick={() => router.push(config.backPath)}
        className="absolute top-5 left-5 bg-nav-bg border border-nav-border rounded-xl px-3.5 py-2 text-xs font-medium text-(--foreground) hover:border-brand-400 transition flex items-center gap-1.5 shadow-nav"
      >
        ← Geri
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-nav-bg border border-nav-border rounded-2xl p-10 w-full max-w-sm shadow-nav relative z-10"
      >
        <div className="mb-4 inline-flex p-3 rounded-xl bg-(--background) border border-nav-border text-brand-500">
          {config.icon}
        </div>

        {config.eyebrow && (
          <p
            className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-text mb-1"
            style={{
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {config.eyebrow}
          </p>
        )}

        <h1
          className="text-2xl font-extrabold mb-1"
          style={{
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {config.title}
        </h1>

        {config.subtitle && (
          <p className="text-sm opacity-60 mb-6">
            {config.subtitle}
          </p>
        )}

        {!config.subtitle && (
          <div className="mb-6" />
        )}

        {error && (
          <p className="text-red-500 text-xs mb-4">
            {error}
          </p>
        )}

        {rows.map((row, index) => (
          <div
            key={index}
            className={
              row.length > 1
                ? "flex gap-3 mb-4"
                : "mb-4"
            }
          >
            {row.map(renderField)}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-brand-500 text-white font-bold text-sm tracking-wide mt-2 hover:bg-brand-600 active:scale-[0.98] transition disabled:opacity-50 shadow-nav"
        >
          {loading
            ? "Kaydediliyor..."
            : "Kayıt Ol"}
        </button>

        <p className="text-center text-xs opacity-50 mt-5">
          Zaten hesabınız var mı?{" "}

          <button
            type="button"
            onClick={() =>
              router.push(config.loginPath)
            }
            className="text-brand-text font-medium cursor-pointer hover:underline"
          >
            Giriş Yap
          </button>
        </p>
      </form>
    </main>
  );
}