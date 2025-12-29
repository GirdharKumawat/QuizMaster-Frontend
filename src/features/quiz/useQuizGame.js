import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { quizApi } from '../../api/quizApi';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useTimer } from '../../hooks/useTimer';

export const useQuizGame = (session_id,isHost) => {

    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    
    const [participants, setParticipants] = useState([]); 
   
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
                setParticipants(prev => {
                    // Prevent duplicates
                    if (prev.find(p => p.user_id === data.user_id)) return prev;
                    return [...prev, { user_id: data.user_id, name: data.name, score: 0 }];
                });
                // Only show toast if we are in the lobby (not playing yet)
                if (!currentQuestion) toast.info(`${data.name} joined!`);
                break;

            case 'quiz_started':
                if (isHost===false) {
                toast.success("Quiz Started! Good luck.");
                navigate(`/quiz/${session_id}`);
                }
                else navigate(`/leaderboard/${session_id}`);

                break;
                
            case 'quiz_ended':
                toast.warning("The Host has ended the quiz.");
                navigate(`/leaderboard/${session_id}`);
                break;

            case 'leaderboard_update':
                // Update specific user's score in the list
                console.log("Leaderboard update received:", data);
                setParticipants(prev => {
                    const existing = prev.find(p => p.user_id === data.user_id);
                    if (existing) {
                        return prev.map(p => 
                            p.user_id === data.user_id 
                                ? { ...p, score: data.total_score }
                                : p
                        );
                    }
                    // If we never had this user (e.g., page opened late), append them
                    return [
                        ...prev,
                        {
                            user_id: data.user_id,
                            name: data.name || data.username || "Unknown",
                            score: data.total_score || data.score || 0,
                        }
                    ];
                });
                break;
                
            default: break;
        }
    }, [session_id, navigate, currentQuestion]);

    // Initialize Socket
    useWebSocket(session_id, {
        'participant_joined': handleWsMessage,
        'quiz_started': handleWsMessage,
        'quiz_ended': handleWsMessage,
        'leaderboard_update': handleWsMessage
    });

    // --- TIMER LOGIC ---
    const handleTimeExpire = () => {
        toast.info("Time's up for this question!");
    };
    
    const { timeLeft, formatTime } = useTimer(serverDuration, handleTimeExpire);

    // Stable setter so consumers can seed initial participants without re-renders
    const setInitialParticipants = useCallback((list) => setParticipants(list || []), []);


    // --- ACTIONS ---

    // 1. HOST: Start the Quiz (The missing function!)
    const startQuiz = async () => {
        try {
            setLoading(true);
            await quizApi.startQuiz(session_id);
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
            const statusRes = await quizApi.getStatus(session_id);
            const { attempted_indices, current_score } = statusRes.data;

            const paperRes = await quizApi.getPaper(session_id);

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
                navigate(`/leaderboard/${session_id}`);
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
                session_id: session_id,
                question_index: currentIndex,
                selected_option: selectedOption
            });

            if (res.data.points > 0) {
                setScore(s => s + res.data.points);
            }
        } catch (err) {
            console.error("Submit failed", err);
        }
    };

    // 4. HOST: End Quiz (Optional, but good to have)
    const endQuiz = async () => {
        try {
            await quizApi.endQuiz(session_id);
        } catch (err) {
            toast.error("Failed to end quiz");
        }
    };

    const getLeaderboard = async () => {
        try {
            setLoading(true);
            const res = await quizApi.getLeaderboard(session_id);
            setParticipants(res.data.leaderboard || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load leaderboard");
        } finally {
            setLoading(false);
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
        getLeaderboard,
        setInitialParticipants
    };
};