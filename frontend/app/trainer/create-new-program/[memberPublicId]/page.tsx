'use client';

import { useParams } from 'next/navigation';
import React from 'react';

const CreateProgramPage = () => {
    const params = useParams();
    const memberPublicId = params?.memberPublicId as string;

    console.log("Member Public ID:", memberPublicId);

    return (
        <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] p-6 sm:p-10 flex items-center justify-center">
            <div className="max-w-xl w-full bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-nav)] text-center">
                <h1 className="text-xl font-bold tracking-tight mb-2">Program Oluşturma Sayfası</h1>
                <p className="text-sm opacity-70">
                    Aktif Sporcu ID: <span className="font-mono font-semibold text-[var(--brand-500)]">{memberPublicId || "Bulunamadı"}</span>
                </p>
            </div>
        </div>
    );
};

export default CreateProgramPage;   