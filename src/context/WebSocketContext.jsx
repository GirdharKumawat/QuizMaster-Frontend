import  { createContext, useContext, useRef, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { WS_ENDPOINT } from "../key";
import {
    updateParticipantScore,
    updateParticipantStatus,
  addParticipant,
  setStatus,
} from "../features/quiz/quizSessionSlice";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const connect = (sessionId) => {
    // 1. Prevent Duplicate Connections
    if (
      socketRef.current?.url?.includes(sessionId) &&
      socketRef.current?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    // 2. Close existing connection if switching sessions
    if (socketRef.current) {
      socketRef.current.close();
    }

   
    const wsUrl = `${WS_ENDPOINT}ws/quiz/${sessionId}/`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    // 4. Handle Incoming Messages -> Dispatch to Redux
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "participant_joined":
            console.log("Received new participant via WS:", data);
            dispatch(
              addParticipant({
                user_id: data.user_id,
                name: data.name,
                score: data.score,
                status: data.status,
                start_time: data.start_time,
              })
            );
            break;

          case "quiz_started":
            dispatch(setStatus("active"));
            break;

          case "quiz_ended":
            dispatch(setStatus("completed"));
            break;

          case "update_participant_score":
            dispatch(
              updateParticipantScore({
                user_id: data.user_id,
                score: data.score,
              })
            );
            break;
          case "update_participant_status":
            console.log("Received participant status update via WS:", data);
            dispatch(
              updateParticipantStatus({
                user_id: data.user_id,
                status: data.status,
                start_time: data.start_time,
              })
            );
            break;

          default:
            break;
        }
      } catch (err) {
        console.error("WS Parse Error", err);
      }
    };

    ws.onopen = () => {
      console.log("[Context] Connected");
      setIsWebSocketConnected(true);
    };
    ws.onclose = () => {
      console.log("[Context] Disconnected");
      setIsWebSocketConnected(false);
    };
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setIsWebSocketConnected(false);
    }
  };

  const value = useMemo(() => ({ connect, disconnect, isWebSocketConnected }), [isWebSocketConnected]);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useGlobalWebSocket = () => useContext(WebSocketContext);
