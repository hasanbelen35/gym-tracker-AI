import React, { useEffect, useState } from "react";

interface SuccessBoxProps {
  message: string | null;
}

export function SuccessBox({ message }: SuccessBoxProps) {
  const [hiddenMessage, setHiddenMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setHiddenMessage(message);
    }, 2000);

    return () => clearTimeout(timer);
  }, [message]);

  if (!message || hiddenMessage === message) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3.5 text-xs text-emerald-500 shadow-sm backdrop-blur-sm animate-fade-in">
      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-500/20 font-bold text-emerald-500">
        ✓
      </span>

      <span className="font-semibold">{message}</span>
    </div>
  );
}