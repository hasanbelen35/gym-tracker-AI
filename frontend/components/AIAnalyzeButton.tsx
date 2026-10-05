'use client'
import React from "react";
import { RobotIcon } from '@/icons/icon';

interface AIAnalyzeButtonProps {
    onClick: () => void;
    label?: string;
    className?: string;
}

export const AIAnalyzeButton: React.FC<AIAnalyzeButtonProps> = ({
    onClick,
    label = "AI Performans Analizi",
    className = ""
}) => {
    return (
        <button
            onClick={onClick}
            className={`group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${className}`}
        >
            <span className="absolute inset-0 bg-gradient-to-r from-brand-500 via-purple-600 to-pink-600 animate-gradient bg-[length:200%_200%] transition-all group-hover:opacity-90" />
            
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <span className="relative z-10 flex items-center gap-2">
                <RobotIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                {label}
            </span>
        </button>
    );
};