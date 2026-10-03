
import React from 'react';
import { TrainerInfoCardProps } from "@/features/gym/trainer-detail/types";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface DetailRowProps {
    label: string;
    value: string | number | undefined; 
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
    <div className="flex justify-between py-3.5 border-b border-nav-border last:border-0">
        <span className="text-sm font-medium text-foreground/60">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value ?? "-"}</span>
    </div>
);

export const TrainerInfoCard: React.FC<TrainerInfoCardProps> = ({ trainer }) => {
    const router = useRouter();

    return (
        <div className="space-y-8">
            
            {/* 1. MAIN INFO CARD */}
            <section className="bg-nav-bg border border-nav-border rounded-2xl p-6 md:p-8 shadow-sm transition-colors">
                <div className="flex items-center justify-between pb-6 border-b border-nav-border mb-6">
                    <div className="flex items-center gap-4">
                        {/* AVATAR SECTION */}
                        <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-brand-50 border border-brand-400/30 flex items-center justify-center text-brand-500 font-black text-lg shadow-sm">
                            {trainer.avatarUrl ? (
                                <Image 
                                    src={trainer.avatarUrl} 
                                    alt={`${trainer.name} ${trainer.surname}`} 
                                    fill 
                                    className="object-cover"
                                />
                            ) : (
                                <span>{trainer.name?.charAt(0)}{trainer.surname?.charAt(0)}</span>
                            )}
                        </div>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-brand-text">
                                ANTRENÖR PROFİLİ
                            </span>
                            <h1 className="mt-1 text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground">
                                {trainer.name} {trainer.surname}
                            </h1>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col">
                    <DetailRow label="E-posta Adresi" value={trainer.email} />
                    <DetailRow label="Toplam Sporcu Sayısı" value={trainer.myMembers?.length || 0} />
                    <DetailRow label="Toplam Program Sayısı" value={trainer.programs?.length || 0} />
                    <DetailRow 
                        label="Sisteme Kayıt Tarihi" 
                        value={trainer.createdAt ? new Date(trainer.createdAt).toLocaleDateString("tr-TR") : "-"} 
                    />
                </div>
            </section>

            {/* 2. ASSIGNED MEMBERS SECTION */}
            <section className="bg-nav-bg border border-nav-border rounded-2xl p-6 md:p-8 shadow-sm transition-colors">
                <h2 className="text-lg font-black uppercase tracking-tight text-foreground mb-4">
                    Çalıştığı Sporcular ({trainer.myMembers?.length || 0})
                </h2>

                {!trainer.myMembers || trainer.myMembers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-nav-border py-8 text-center bg-background/40">
                        <p className="text-xs text-foreground/50">Bu antrenöre atanmış aktif sporcu bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="border-b border-nav-border bg-foreground/5 text-[11px] font-bold uppercase tracking-wider text-foreground/60">
                                <tr>
                                    <th className="px-4 py-3">Sporcu Adı Soyadı</th>
                                    <th className="px-4 py-3">E-posta</th>
                                    <th className="px-4 py-3 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-nav-border/50">
                                {trainer.myMembers.map((member) => (
                                    <tr key={member.publicId || member.id} className="transition-colors hover:bg-brand-50/5">
                                        <td className="px-4 py-3 font-semibold text-foreground">
                                            {member.name} {member.surname}
                                        </td>
                                        <td className="px-4 py-3 text-foreground/70">
                                            {member.email}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => member.publicId && router.push(`/gym/members/${member.publicId}`)}
                                                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-brand-500/20 bg-brand-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-500 transition-colors hover:bg-brand-500 hover:text-white"
                                            >
                                                Detay
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* 3. PROGRAMS SECTION */}
            <section className="bg-nav-bg border border-nav-border rounded-2xl p-6 md:p-8 shadow-sm transition-colors">
                <h2 className="text-lg font-black uppercase tracking-tight text-foreground mb-4">
                    Oluşturulan Programlar ({trainer.programs?.length || 0})
                </h2>

                {!trainer.programs || trainer.programs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-nav-border py-8 text-center bg-background/40">
                        <p className="text-xs text-foreground/50">Bu antrenör tarafından oluşturulmuş program bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="border-b border-nav-border bg-foreground/5 text-[11px] font-bold uppercase tracking-wider text-foreground/60">
                                <tr>
                                    <th className="px-4 py-3">Program Başlığı</th>
                                    <th className="px-4 py-3">Split Tipi</th>
                                    <th className="px-4 py-3">Atanan Sporcu</th>
                                    <th className="px-4 py-3">Durum</th>
                                    <th className="px-4 py-3">Oluşturulma Tarihi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-nav-border/50">
                                {trainer.programs.map((program) => (
                                    <tr key={program.id} className="transition-colors hover:bg-brand-50/5">
                                        <td className="px-4 py-3 font-semibold text-foreground">
                                            {program.title}
                                        </td>
                                        <td className="px-4 py-3 text-foreground/80">
                                            {program.splitType}
                                        </td>
                                        <td className="px-4 py-3 text-foreground/70">
                                            {program.member ? `${program.member.name} ${program.member.surname}` : "Atanmamış"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                program.isActive 
                                                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                    : 'border-nav-border bg-foreground/5 text-foreground/50'
                                            }`}>
                                                {program.isActive ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-foreground/70">
                                            {new Date(program.createdAt).toLocaleDateString("tr-TR")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

        </div>
    );
};