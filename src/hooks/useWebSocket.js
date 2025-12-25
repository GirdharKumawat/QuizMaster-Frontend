import { useEffect, useRef } from 'react';
import { API_ENDPOINT } from '../key';

export const useWebSocket = (sessionId, handlers = {}) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!sessionId) return;

        // Auto-switch between ws:// and wss://
        const wsProtocol = globalThis.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const cleanHost = API_ENDPOINT.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const wsUrl = `${wsProtocol}//${cleanHost}/ws/quiz/${sessionId}/`;

        console.log(" Connecting to WS:", wsUrl);
        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => console.log("✅ WebSocket Connected");
        
        socketRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (handlers[data.type]) {
                    handlers[data.type](data);
                }
            } catch (err) {
                console.error("WS Parse Error", err);
            }
        };

        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, [sessionId]);

    return socketRef.current;
};