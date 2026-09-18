import { loginMember, loginGym, loginTrainer } from "@/store/slices/authSlice";
import { AthleteIcon, GymIcon, TrainerIcon } from "@/icons/icon";
import type { AppDispatch } from "@/store/store";

export type LoginRole = "athlete" | "gym" | "trainer";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginConfig {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  emailPlaceholder: string;
  registerPath: string;
  backPath: string;
  dashboardPath: string;
  completeProfilePath?: string;
  requiresProfileCheck: boolean;
  login: (
    dispatch: AppDispatch,
    formData: LoginFormData
  ) => Promise<{ success: boolean; isProfileCompleted?: boolean }>;
}

export const loginConfigs: Record<LoginRole, LoginConfig> = {
  athlete: {
    title: "Üye Girişi",
    subtitle: "Hoş geldiniz, giriş yapın.",
    icon: <AthleteIcon className="w-8 h-8" />,
    emailPlaceholder: "uye@example.com",
    registerPath: "/register/athlete",
    backPath: "/login",
    dashboardPath: "/dashboard/athlete",
    completeProfilePath: "/athlete/complateProfile",
    requiresProfileCheck: true,
    login: async (dispatch, formData) => {
      const result = await dispatch(loginMember(formData));
      if (loginMember.fulfilled.match(result)) {
        return {
          success: true,
          isProfileCompleted: result.payload.member?.isProfileCompleted,
        };
      }
      return { success: false };
    },
  },
  trainer: {
    title: "Antrenör Girişi",
    subtitle: "Hoş geldiniz, giriş yapın.",
    icon: <TrainerIcon className="w-8 h-8" />,
    emailPlaceholder: "antrenor@example.com",
    registerPath: "/register/trainer",
    backPath: "/login",
    dashboardPath: "/dashboard/trainer",
    completeProfilePath: "/trainer/complateProfile",
    requiresProfileCheck: true,
    login: async (dispatch, formData) => {
      const result = await dispatch(loginTrainer(formData));
      if (loginTrainer.fulfilled.match(result)) {
        return {
          success: true,
          isProfileCompleted: result.payload.trainer?.isProfileCompleted,
        };
      }
      return { success: false };
    },
  },
  gym: {
    title: "Spor Salonu Girişi",
    subtitle: "Hesabınıza giriş yaparak başlayın.",
    icon: <GymIcon className="w-8 h-8" />,
    emailPlaceholder: "salon@example.com",
    registerPath: "/register/gym",
    backPath: "/login",
    dashboardPath: "/dashboard/gym",
    requiresProfileCheck: false,
    login: async (dispatch, formData) => {
      const result = await dispatch(loginGym(formData));
      if (loginGym.fulfilled.match(result)) {
        return { success: true };
      }
      return { success: false };
    },
  },
};