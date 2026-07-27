import React from "react";

interface ErrorBoxProps {
  message: string | null;
}

export function ErrorBox({ message }: ErrorBoxProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3.5 text-xs text-red-500 shadow-sm backdrop-blur-sm animate-fade-in">
      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-red-500/20 font-bold text-red-500">
        !
      </span>
      <span className="font-semibold">{message}</span>
    </div>
  );
}