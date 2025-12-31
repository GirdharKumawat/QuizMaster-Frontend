import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialTime, onExpire) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const onExpireRef = useRef(onExpire);
    const intervalRef = useRef(null);
    const initialTimeRef = useRef(initialTime);

    // Keep initialTimeRef updated when initialTime changes
    useEffect(() => {
        initialTimeRef.current = initialTime;
    }, [initialTime]);

    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    // Start the timer manually - uses ref to get latest value
    const startTimer = useCallback((overrideTime) => {
        const duration = overrideTime || initialTimeRef.current;
        if (!duration || duration <= 0) {
            console.warn('Timer: Cannot start with duration:', duration);
            return;
        }
        console.log('Timer: Starting with duration:', duration);
        setTimeLeft(duration);
        setIsRunning(true);
    }, []);

    // Stop/pause the timer
    const stopTimer = useCallback(() => {
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Reset the timer
    const resetTimer = useCallback(() => {
        stopTimer();
        setTimeLeft(initialTimeRef.current || 0);
    }, [stopTimer]);

    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    setIsRunning(false);
                    if (onExpireRef.current) onExpireRef.current();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning]);

    const formatTime = useCallback((s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }, []);

    return { 
        timeLeft, 
        isRunning,
        startTimer,
        stopTimer,
        resetTimer,
        formatTime,
    };
};