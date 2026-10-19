import { useState, useEffect } from 'react';

export const useWorkoutTimer = (startedAt: string) => {
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

    useEffect(() => {
        const startTime = new Date(startedAt).getTime();
        
        const updateTimer = () => {
            const now = new Date().getTime();
            const diffInSeconds = Math.floor((now - startTime) / 1000);
            setElapsedSeconds(diffInSeconds > 0 ? diffInSeconds : 0);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [startedAt]);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return { elapsedSeconds, formattedTime: formatTime(elapsedSeconds) };
};