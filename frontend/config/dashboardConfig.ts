import { LeftNavDataType } from "@/types/types";

{/* LEFT SIDE-MENU ATHLETE CONFIG*/ }
export const LeftNavDataAthlete: LeftNavDataType[] = [
    { name: "Ana Sayfa", route: "/dashboard" },
    { name: "Antrenmanlar", route: "/dashboard/workouts" },
    { name: "Beslenme", route: "/dashboard/nutrition" },
    { name: "İstatistikler", route: "/dashboard/statistics" },
    { name: "Profil", route: "/dashboard/profile" },
];

{/* LEFT SIDE-MENU GYM CONFIG*/ }
export const LeftNavDataGym: LeftNavDataType[] = [
    { name: "Ana Sayfa", route: "/dashboard" },
    { name: "Üyeler", route: "/dashboard/workouts" },
    { name: "Antrenörler", route: "/dashboard/nutrition" },
    { name: "Salon Kayıtları", route: "/dashboard/statistics" },
    { name: "Ayarlar", route: "/dashboard/profile" },
    { name: "Ayarlar", route: "/dashboard/settings" },
];