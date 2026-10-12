"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkIn, checkOut, getSessionsByUser } from "@/store/slices/sessionSlice";
import { useAuth } from "@/hooks/useAuth";
import SessionView from "../components/SessionView";

export default function SessionContainer() {
  const dispatch = useAppDispatch();
  const { isActive, loading, history } = useAppSelector((state) => state.session);
  const { user } = useAuth();

  // eslint-disable-next-line react-hooks/purity
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [sessionSummary, setSessionSummary] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getSessionsByUser());
  }, [dispatch]);

  const activeSession = history.find((s) => !s.checkOut);
  const startTime = activeSession ? new Date(activeSession.checkIn).getTime() : null;

  const totalSeconds = isActive && startTime ? Math.floor((currentTime - startTime) / 1000) : 0;
  const seconds = totalSeconds > 0 ? totalSeconds : 0;

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => {
    if (!user?.gymId) {
      console.error("Kullanıcının bağlı olduğu gym bulunamadı.", user);
      return;
    }
    setSessionSummary(null);
    dispatch(checkIn(user.gymId)).then(() => {
      dispatch(getSessionsByUser());
    });
  };

  const handleEnd = () => {
    const finalSeconds = seconds;

    dispatch(checkOut())
      .unwrap()
      .then(() => {
        const minutes = Math.floor(finalSeconds / 60);
        const remainingSeconds = finalSeconds % 60;
        setSessionSummary(`${minutes} dakika ${remainingSeconds} saniye spor yaptın!`);
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
    <SessionView
      isActive={isActive}
      loading={loading}
      history={history}
      seconds={seconds}
      sessionSummary={sessionSummary}
      onStart={handleStart}
      onEnd={handleEnd}
      formatTime={formatTime}
      formatDuration={formatDuration}
    />
  );
}