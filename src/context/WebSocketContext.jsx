import  { createContext, useContext, useRef, useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { WS_ENDPOINT } from "../key";
import {
    updateParticipantScore,
    updateParticipantStatus,
  addParticipant,
  setStatus,
  markAllParticipantsCompleted,
} from "../features/quiz/quizSessionSlice";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const connect = useCallback((sessionId) => {
    // 1. Prevent duplicate connections — already open or connecting to the same session
    if (
      socketRef.current?.url?.includes(sessionId) &&
      (socketRef.current?.readyState === WebSocket.OPEN ||
       socketRef.current?.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    // 2. Close existing connection if switching sessions
    if (socketRef.current) {
      // Remove handlers before closing to avoid stale state updates
      socketRef.current.onopen = null;
      socketRef.current.onclose = null;
      socketRef.current.onmessage = null;
      socketRef.current.close();
      socketRef.current = null;
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
            dispatch(markAllParticipantsCompleted());
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
      // Only update state if this socket is still the current one
      if (socketRef.current === ws) {
        setIsWebSocketConnected(true);
      }
    };
    ws.onclose = () => {
      // Only update state if this socket is still the current one
      if (socketRef.current === ws) {
        setIsWebSocketConnected(false);
      }
    };
  }, [dispatch]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.onopen = null;
      socketRef.current.onclose = null;
      socketRef.current.onmessage = null;
      socketRef.current.close();
      socketRef.current = null;
      setIsWebSocketConnected(false);
    }
  }, []);

  const value = useMemo(() => ({ connect, disconnect, isWebSocketConnected }), [connect, disconnect, isWebSocketConnected]);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useGlobalWebSocket = () => useContext(WebSocketContext);
