import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime, onExpire) => {
    const [timeLeft, setTimeLeft] = useState(initialTime || 0);
    const onExpireRef = useRef(onExpire);

    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    useEffect(() => {
        if (!initialTime || initialTime <= 0) return;
        setTimeLeft(initialTime);

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    if (onExpireRef.current) onExpireRef.current();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [initialTime]);

    return { 
        timeLeft, 
        formatTime: (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}` 
    };
};