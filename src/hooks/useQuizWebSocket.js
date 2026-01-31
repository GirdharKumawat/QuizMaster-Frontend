import { useEffect, useRef } from 'react';
import { useGlobalWebSocket } from '../context/WebSocketContext.jsx';
export const useQuizWebSocket = (sessionId) => {
    const { connect, isWebSocketConnected } = useGlobalWebSocket();
    const lastSessionIdRef = useRef(null);

    useEffect(() => {
        // Always connect if sessionId changed OR not connected yet
        if (sessionId && (sessionId !== lastSessionIdRef.current || !isWebSocketConnected)) {
            lastSessionIdRef.current = sessionId;
            connect(sessionId);
        }
        }, [sessionId, connect, isWebSocketConnected]);
};