import { useEffect, useRef } from 'react';
import { useGlobalWebSocket } from '../context/WebSocketContext.jsx';
export const useQuizWebSocket = (sessionId) => {
    const { connect } = useGlobalWebSocket();
    const lastSessionIdRef = useRef(null);

    useEffect(() => {
        if (!sessionId) return;

        // Only connect if the session actually changed
        if (sessionId !== lastSessionIdRef.current) {
            lastSessionIdRef.current = sessionId;
            connect(sessionId);
        }
    }, [sessionId, connect]);
};