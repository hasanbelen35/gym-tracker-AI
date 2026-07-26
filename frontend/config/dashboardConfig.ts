import { LeftNavDataType } from "@/types/types";

{/* LEFT SIDE-MENU ATHLETE CONFIG*/ }
export const LeftNavDataAthlete: LeftNavDataType[] = [
    { name: "Ana Sayfa", route: "/dashboard/athlete" },
    { name: "Geçmiş Antrenmanlarım", route: "/athlete/session" },
    { name: "Salonum", route: "/athlete/myGym" },
    { name: "Antrenörlerim", route: "/athlete/myTrainer" },
    { name: "Beslenme Programlarım", route: "/athlete/nutritions" },
    { name: "Antrenman Programlarım", route: "/athlete/workouts" },
    { name: "İstatistikler", route: "/dashboard/statistics" },
    { name: "Profil", route: "/dashboard/profile" },
];

{/* LEFT SIDE-MENU GYM CONFIG*/ }
export const LeftNavDataGym: LeftNavDataType[] = [
    { name: "Ana Sayfa", route: "/dashboard/gym" },
    { name: "Üyeler", route: "/gym/members" },
    { name: "Antrenörler", route: "/gym/trainers" },
    { name: "Antrenör Atamaları", route: "/gym/assignments" },
    { name: "Salon Kayıtları", route: "/gym/sessions" },
    { name: "Ayarlar", route: "/gym/settings" },
];


{/* LEFT SIDE-MENU TRAINER CONFIG*/ }
export const LeftNavDataTrainer: LeftNavDataType[] = [
    { name: "Ana Sayfa", route: "/dashboard/gym" },
    { name: "Sporcu Atamaları", route: "/trainer/assignment-athlete" },
    { name: "Sporcularım", route: "/trainer/athletes" },
    { name: "Programlarım", route: "/trainer/exercises" },
    { name: "Sporcu Kayıtlarım", route: "/trainer/athleteRecords" },
    { name: "profil", route: "/trainer/profile" },
    { name: "Ayarlar", route: "/dashboard/settings" },
    { name: "test", route: "/trainer/create-new-workout-program" },

];