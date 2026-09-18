import {
  registerGym,
  registerMember,
  registerTrainer,
} from "@/store/slices/authSlice";
import { AthleteIcon, GymIcon, TrainerIcon } from "@/icons/icon";
import type { AppDispatch } from "@/store/store";

export type RegisterRole = "athlete" | "trainer" | "gym";

export interface RegisterFieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "tel" | "number" | "gymSelect";
  placeholder?: string;
  required?: boolean;
  span: "full" | "half";
}

interface RegisterConfig<T> {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  fields: RegisterFieldConfig[];
  numericFields: string[];
  requiresGymSelect: boolean;
  loginPath: string;
  backPath: string;
  register: (dispatch: AppDispatch, payload: T) => Promise<boolean>;
}

type RegisterMemberPayload = Parameters<typeof registerMember>[0];
type RegisterTrainerPayload = Parameters<typeof registerTrainer>[0];
type RegisterGymPayload = Parameters<typeof registerGym>[0];

export type RegisterConfigMap = {
  athlete: RegisterConfig<RegisterMemberPayload>;
  trainer: RegisterConfig<RegisterTrainerPayload>;
  gym: RegisterConfig<RegisterGymPayload>;
};

export const registerConfigs: RegisterConfigMap = {
  athlete: {
    eyebrow: "Üye Kaydı",
    title: "Sporcu Kayıt",
    icon: <AthleteIcon className="w-8 h-8" />,
    backPath: "/register",
    loginPath: "/login/athlete",
    requiresGymSelect: true,
    numericFields: ["gymId", "age"],
    fields: [
      {
        name: "name",
        label: "Ad",
        type: "text",
        required: true,
        span: "half",
      },
      {
        name: "surname",
        label: "Soyad",
        type: "text",
        required: true,
        span: "half",
      },
      {
        name: "email",
        label: "E-posta",
        type: "email",
        placeholder: "sporcu@example.com",
        required: true,
        span: "full",
      },
      {
        name: "password",
        label: "Şifre",
        type: "password",
        placeholder: "••••••••",
        required: true,
        span: "full",
      },
      {
        name: "gymId",
        label: "Spor Salonu",
        type: "gymSelect",
        required: true,
        span: "full",
      },
      {
        name: "age",
        label: "Yaş",
        type: "number",
        span: "half",
      },
      {
        name: "phone",
        label: "Telefon",
        type: "tel",
        placeholder: "0500...",
        span: "half",
      },
    ],
    register: async (dispatch, payload) => {
      const result = await dispatch(registerMember(payload));
      return registerMember.fulfilled.match(result);
    },
  },

  trainer: {
    title: "Antrenör Kaydı",
    subtitle: "Bilgilerinizi girerek kayıt olun.",
    icon: <TrainerIcon className="w-8 h-8" />,
    backPath: "/register",
    loginPath: "/login/trainer",
    requiresGymSelect: true,
    numericFields: ["gymId"],
    fields: [
      {
        name: "name",
        label: "Ad",
        type: "text",
        required: true,
        span: "full",
      },
      {
        name: "surname",
        label: "Soyad",
        type: "text",
        required: true,
        span: "full",
      },
      {
        name: "email",
        label: "E-posta",
        type: "email",
        placeholder: "antrenor@example.com",
        required: true,
        span: "full",
      },
      {
        name: "password",
        label: "Şifre",
        type: "password",
        placeholder: "••••••••",
        required: true,
        span: "full",
      },
      {
        name: "gymId",
        label: "Spor Salonu",
        type: "gymSelect",
        required: true,
        span: "full",
      },
    ],
    register: async (dispatch, payload) => {
      const result = await dispatch(registerTrainer(payload));
      return registerTrainer.fulfilled.match(result);
    },
  },

  gym: {
    title: "Spor Salonu Kayıt",
    icon: <GymIcon className="w-8 h-8" />,
    backPath: "/register",
    loginPath: "/login/gym",
    requiresGymSelect: false,
    numericFields: [],
    fields: [
      {
        name: "name",
        label: "Salon Adı",
        type: "text",
        required: true,
        span: "full",
      },
      {
        name: "email",
        label: "E-posta",
        type: "email",
        placeholder: "salon@example.com",
        required: true,
        span: "full",
      },
      {
        name: "password",
        label: "Şifre",
        type: "password",
        placeholder: "••••••••",
        required: true,
        span: "full",
      },
      {
        name: "address",
        label: "Adres",
        type: "text",
        span: "full",
      },
      {
        name: "phone",
        label: "Telefon",
        type: "tel",
        span: "full",
      },
    ],
    register: async (dispatch, payload) => {
      const result = await dispatch(registerGym(payload));
      return registerGym.fulfilled.match(result);
    },
  },
};

export function buildRegisterPayload<T>(
  formData: Record<string, string>,
  numericFields: string[]
): T {
  const payload: Record<string, unknown> = {};

  Object.keys(formData).forEach((key) => {
    const value = formData[key].trim();

    if (value === "") {
      return;
    }

    if (numericFields.includes(key)) {
      payload[key] = Number(value);
    } else {
      payload[key] = value;
    }
  });

  return payload as T;
}

export function groupFieldsIntoRows(
  fields: RegisterFieldConfig[]
): RegisterFieldConfig[][] {
  const rows: RegisterFieldConfig[][] = [];
  let i = 0;

  while (i < fields.length) {
    const field = fields[i];

    if (
      field.span === "half" &&
      fields[i + 1]?.span === "half"
    ) {
      rows.push([field, fields[i + 1]]);
      i += 2;
    } else {
      rows.push([field]);
      i += 1;
    }
  }

  return rows;
}