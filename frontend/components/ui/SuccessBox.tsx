import React from "react";

interface SuccessBoxProps {
  message: string | null;
}

export function SuccessBox({ message }: SuccessBoxProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3.5 text-xs text-emerald-500 shadow-sm backdrop-blur-sm animate-fade-in">
      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-500/20 font-bold text-emerald-500">
        ✓
      </span>
      <span className="font-semibold">{message}</span>
    </div>
  );
} 