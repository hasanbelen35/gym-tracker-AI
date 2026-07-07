"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkIn, checkOut, getSessionsByUser } from "@/store/slices/sessionSlice";
import { useAuth } from "@/hooks/useAuth";

export default function SessionPage() {
  const dispatch = useAppDispatch();
  const { isActive, loading, history } = useAppSelector((state) => state.session);
  const { user } = useAuth(); // gymId burada, JWT'den decode edilmiş

  const [seconds, setSeconds] = useState(0);
  const [sessionSummary, setSessionSummary] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getSessionsByUser());
  }, [dispatch]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => {
    if (!user?.gymId) {
      console.error("Kullanıcının bağlı olduğu gym bulunamadı.", user);
      return;
    }
    setSeconds(0);
    setSessionSummary(null);
    dispatch(checkIn(user.gymId));
  };

  const handleEnd = () => {
    const finalSeconds = seconds;

    dispatch(checkOut())
      .unwrap()
      .then(() => {
        const minutes = Math.floor(finalSeconds / 60);
        const remainingSeconds = finalSeconds % 60;
        setSessionSummary(`${minutes} dakika ${remainingSeconds} saniye spor yaptın!`);
        setSeconds(0);
        dispatch(getSessionsByUser());
      })
      .catch((err) => console.error(err));
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} dk`;
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return remaining === 0 ? `${hours} sa` : `${hours} sa ${remaining} dk`;
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 transition-colors">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <div className="rounded-2xl border border-nav-border bg-nav-bg p-8 text-center shadow-nav">
          <h2 className="mb-1 text-lg font-semibold text-foreground">Antrenman Oturumu</h2>
          <p className="mb-8 text-sm text-brand-text">
            {isActive ? "Antrenman devam ediyor" : "Başlamaya hazır mısın?"}
          </p>

          <div
            className={`mb-8 font-mono text-6xl font-bold tracking-tight transition-colors ${
              isActive ? "text-brand-500" : "text-brand-text"
            }`}
          >
            {formatTime(seconds)}
          </div>

          {!isActive ? (
            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 py-4 font-bold text-white shadow-sm transition-all hover:from-brand-600 hover:to-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Başlatılıyor..." : "Antrenmanı Başlat"}
            </button>
          ) : (
            <button
              onClick={handleEnd}
              disabled={loading}
              className="w-full rounded-xl bg-red-500 py-4 font-bold text-white shadow-sm transition-all hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Bitiriliyor..." : "Antrenmanı Bitir"}
            </button>
          )}

          {sessionSummary && (
            <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-600 dark:border-brand-100/20 dark:bg-brand-100/10">
              {sessionSummary}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-text">
            Geçmiş Oturumlar
          </h3>

          <div className="overflow-hidden rounded-2xl border border-nav-border bg-nav-bg shadow-nav">
            {history.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <p className="text-sm text-brand-text">Henüz geçmiş oturum bulunmuyor.</p>
              </div>
            ) : (
              <ul className="divide-y divide-nav-border">
                {history.map((session) => (
                  <li
                    key={session.id}
                    className="flex items-center justify-between px-4 py-4 transition-colors hover:bg-brand-50 dark:hover:bg-brand-100/10"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(session.checkIn).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "long",
                        })}
                      </p>
                      <p className="mt-0.5 text-xs text-brand-text">
                        {new Date(session.checkIn).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" - "}
                        {session.checkOut
                          ? new Date(session.checkOut).toLocaleTimeString("tr-TR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Devam Ediyor"}
                      </p>
                    </div>
                    <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600 dark:bg-brand-100/10">
                      {session.checkOut ? formatDuration(session.duration) : "Aktif"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}