import { useEffect } from 'react';
import { useGlobalWebSocket } from '../context/WebSocketContext.jsx';
export const useQuizWebSocket = (sessionId) => {
    const { connect,isWebSocketConnected } = useGlobalWebSocket();

    useEffect(() => {

        if (isWebSocketConnected) {
            return;
        }

        if (sessionId) {
            connect(sessionId);
        }
         
    }, [sessionId, connect]);
};