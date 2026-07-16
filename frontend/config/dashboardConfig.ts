import { LeftNavDataType } from "@/types/types";

{/* LEFT SIDE-MENU ATHLETE CONFIG*/ }
export const LeftNavDataAthlete: LeftNavDataType[] = [
    { name: "Ana Sayfa", route: "/dashboard/athlete" },
    { name: "Antrenmanlar", route: "/athlete/session" },
    { name: "Beslenme", route: "/dashboard/nutrition" },
    { name: "İstatistikler", route: "/dashboard/statistics" },
    { name: "Profil", route: "/dashboard/profile" },
];

{/* LEFT SIDE-MENU GYM CONFIG*/ }
export const LeftNavDataGym: LeftNavDataType[] = [
    { name: "Ana Sayfa", route: "/dashboard/gym" },
    { name: "Üyeler", route: "/dashboard/workouts" },
    { name: "Antrenörler", route: "/dashboard/nutrition" },
    { name: "Salon Kayıtları", route: "/gym/sessions" },
    { name: "Ayarlar", route: "/dashboard/profile" },
    { name: "Ayarlar", route: "/dashboard/settings" },
];


{/* LEFT SIDE-MENU GYM CONFIG*/ }
export const LeftNavDataTrainer: LeftNavDataType[] = [
    { name: "Ana Sayfa", route: "/dashboard/gym" },
    { name: "Sporcularım", route: "/dashboard/workouts" },
    { name: "Programlarım", route: "/dashboard/nutrition" },
    { name: "Sporcu Kayıtlarım", route: "/gym/sessions" },
    { name: "profil", route: "/dashboard/profile" },
    { name: "Ayarlar", route: "/dashboard/settings" },
];