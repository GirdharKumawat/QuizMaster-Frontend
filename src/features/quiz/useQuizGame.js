import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { quizApi } from '../../api/quizApi';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useTimer } from '../../hooks/useTimer';

export const useQuizGame = (sessionId,isHost,quiz_id) => {

    console.log("useQuizGame initialized with sessionId:", sessionId, "isHost:", isHost, "quiz_id:", quiz_id);

    const navigate = useNavigate();
    
    // --- STATE ---
    const [loading, setLoading] = useState(false);
    
    // Lobby State
    const [participants, setParticipants] = useState([]); 
    
    // Gameplay State
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [score, setScore] = useState(0);
    
    // Timer State (Server provided duration)
    const [serverDuration, setServerDuration] = useState(0);

    // --- SOCKET HANDLERS ---
    const handleWsMessage = useCallback((data) => {
        switch(data.type) {
            case 'participant_joined':
                console.log("Participant joined:", data);
                setParticipants(prev => {
                    // Prevent duplicates
                    if (prev.find(p => p.user_id === data.user_id)) return prev;
                    return [...prev, { user_id: data.user_id, name: data.name, score: 0 }];
                });
                // Only show toast if we are in the lobby (not playing yet)
                if (!currentQuestion) toast.info(`${data.name} joined!`);
                break;

            case 'quiz_started':
                if (!isHost) {
                toast.success("Quiz Started! Good luck.");
                navigate(`/quiz/${quiz_id}`);
                }
                else navigate(`/leaderboard/${quiz_id}`);

                break;
                
            case 'quiz_ended':
                toast.warning("The Host has ended the quiz.");
                navigate(`/leaderboard/${quiz_id}`);
                break;

            case 'leaderboard_update':
                // Update specific user's score in the list
                setParticipants(prev => prev.map(p => 
                    p.user_id === data.user_id 
                        ? { ...p, score: data.total_score } 
                        : p
                ));
                break;
                
            default: break;
        }
    }, [sessionId, navigate, currentQuestion]);

    // Initialize Socket
    useWebSocket(sessionId, {
        'participant_joined': handleWsMessage,
        'quiz_started': handleWsMessage,
        'quiz_ended': handleWsMessage,
        'leaderboard_update': handleWsMessage
    });

    // --- TIMER LOGIC ---
    const handleTimeExpire = () => {
        // Optional: Force submit or auto-move
        // console.log("Timer expired");
    };
    
    const { timeLeft, formatTime } = useTimer(serverDuration, handleTimeExpire);


    // --- ACTIONS ---

    // 1. HOST: Start the Quiz (The missing function!)
    const startQuiz = async () => {
        try {
            setLoading(true);
            console.log("Starting quiz for session:", sessionId);
            await quizApi.startQuiz(sessionId);
            // No need to navigate here; the 'quiz_started' socket event will handle it for everyone
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to start quiz");
        } finally {
            setLoading(false);
        }
    };

    // 2. STUDENT: Load Game Data (Questions & Status)
    const loadGame = async () => {
        try {
            setLoading(true);
            // A. Check Status (in case of refresh)
            const statusRes = await quizApi.getStatus(sessionId);
            const { attempted_indices, current_score } = statusRes.data;

            // B. Fetch Question Paper
            console.log("Fetching paper for session:", sessionId);
            console.log("Fetching paper for quiz:", quiz_id);

            const paperRes = await quizApi.getPaper(sessionId);

            const { questions, duration } = paperRes.data;

            setTotalQuestions(questions.length);
            setScore(current_score || 0);
            setServerDuration(duration || 60);

            // C. Determine Start Index
            let nextIndex = 0;
            if (attempted_indices?.length > 0) {
                nextIndex = Math.max(...attempted_indices) + 1;
            }

            if (nextIndex >= questions.length) {
                navigate(`/leaderboard/${sessionId}`);
            } else {
                setCurrentIndex(nextIndex);
                setCurrentQuestion(questions[nextIndex]);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load quiz.");
        } finally {
            setLoading(false);
        }
    };

    // 3. STUDENT: Submit Answer
    const submitAnswer = async (selectedOption) => {
        if (!currentQuestion) return;

        try {
            const res = await quizApi.submitAnswer({
                session_id: sessionId,
                question_index: currentIndex,
                selected_option: selectedOption
            });

            if (res.data.points > 0) {
                setScore(s => s + res.data.points);
                toast.success(`Correct! +${res.data.points}`);
            }
        } catch (err) {
            console.error("Submit failed", err);
        }
    };

    // 4. HOST: End Quiz (Optional, but good to have)
    const endQuiz = async () => {
        try {
            await quizApi.endQuiz(sessionId);
        } catch (err) {
            toast.error("Failed to end quiz");
        }
    };

    return {
        // State
        loading,
        participants,      // Lobby/Leaderboard List
        currentQuestion,   // Active Question
        currentIndex,
        totalQuestions,
        score,
        timeLeft: formatTime(timeLeft),

        // Actions
        startQuiz,             // <--- Included now
        loadGame,              // Call this on QuizPage mount
        submitAnswer,          // Call this on "Next" button
        endQuiz,
        setInitialParticipants: (list) => setParticipants(list || [])
    };
};