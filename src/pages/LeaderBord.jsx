import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Home, Medal, Loader2 } from 'lucide-react';
import { Card, Button } from '../components/ui';

import { useQuiz } from '../features/quiz/useQuiz';
import { useAuth } from '../features/auth/useAuth';
import { useQuizGame } from '../features/quiz/useQuizGame';
import { quizApi } from '../api/quizApi';

function LeaderBordPage() {
    const { session_id } = useParams();
    const navigate = useNavigate();
    
    // 1. Global State
    const { quizState, getCreatedQuizzes, getEnrolledQuizzes } = useQuiz();
    const { authState, fetchUser } = useAuth();
    
    // 2. Game Logic (Sockets)
    // We use this to get REAL-TIME updates if people are still playing

    // --- DATA PREP ---
    const { id: userId } = authState;
    const createdQuizzes = quizState.createdQuizzes || [];
    const enrolledQuizzes = quizState.enrolledQuizzes || [];

    // Find the quiz in Redux
    const currentQuiz = [...createdQuizzes, ...enrolledQuizzes].find(q => q.session_id === session_id) || {};
    const isHost = currentQuiz.host_id === userId;

    const { participants, setInitialParticipants } = useQuizGame(session_id, isHost);
    console.log("Participants from useQuizGame:", participants);

    // Determine loading state: if we don't have the quiz ID yet and global loading is true
    const isLoading = quizState.loading && !currentQuiz.session_id;

    // --- INITIALIZATION ---
    useEffect(() => {



        // 1. Ensure User Loaded
        if (!userId) fetchUser();

        // 2. Ensure Quiz Data Loaded (Refresh Protection)
        if (!currentQuiz.quiz_id && quizState.canTry) {
            getCreatedQuizzes();
            getEnrolledQuizzes();
        }

        // 3. Sync Redux Data to Hook State
        // This sets the "Initial" list so the socket has something to update
        if (currentQuiz.participants) {
            setInitialParticipants(currentQuiz.participants);
            console.log("Initial participants set from Redux:", currentQuiz.participants);
        }
        console.log("Current Quiz participants:", participants);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ currentQuiz.quiz_id]); 
    // Dependency on _id ensures this runs once the fetch completes

    // Fetch leaderboard from API to seed local state when sockets haven't sent anything yet
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await quizApi.getLeaderboard(session_id);
                const leaderboardData = res.data?.participants || res.data?.leaderboard || res.data || [];
                const normalized = Array.isArray(leaderboardData)
                    ? leaderboardData.map((p) => ({
                        user_id: p.user_id ?? p.id, 
                        username: p.username || p.name,
                        name: p.username || p.name || "Unknown",
                        score: p.total_score ?? p.score ?? 0,
                    }))
                    : [];

                setInitialParticipants(normalized);
                console.log("Leaderboard fetched from API:", normalized);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            }
        };

        fetchLeaderboard();
    }, [session_id, setInitialParticipants]);

    // --- DERIVED STATE ---
    // Sort participants by score (Descending)
    const sortedLeaderboard = useMemo(() => {
        // Use the hook's 'participants' if available (it has live updates), 
        // fallback to Redux 'currentQuiz.participants'
        const list = participants.length > 0 ? participants : (currentQuiz.participants || []);
        
        return list
            .map((p) => ({
                id: p.user_id,
                name: p.username || p.name || "Unknown",
                score: p.score || 0,
            }))
            .sort((a, b) => b.score - a.score)
            .map((p, index) => ({ ...p, position: index + 1 }));
            
    }, [participants, currentQuiz.participants]);

    const yourStats = sortedLeaderboard.find(p => p.id === userId);
    console.log("Sorted Leaderboard:", sortedLeaderboard);
    console.log("Your Stats:", yourStats);
    // --- RENDER ---
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-purple-600" size={40} />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8 overflow-hidden">
            {/* Background Decor */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.05),transparent_60%)]" />
            
            <div className="relative max-w-6xl mx-auto space-y-10">
                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg ring-4 ring-white/70">
                                <Trophy size={28} />
                            </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                                Leaderboard
                            </span>
                        </h1>
                        <p className="text-sm text-gray-500 font-mono ml-1">
                            {currentQuiz.title || "Quiz Session"}
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
                        >
                            <Home size={18} className="mr-2" />
                            Dashboard
                        </Button>
                    </div>
                </header>

                <div className="grid gap-8 md:grid-cols-3 items-start">
                    
                    {/* Main Table */}
                    <Card className="p-0 md:col-span-2 overflow-hidden border-0 shadow-xl shadow-purple-100/50 ring-1 ring-gray-100">
                        <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800 text-lg">Rankings</h3>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                {participants.length > 0 ? "Live Updates" : "Final"}
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50/50">
                                    <tr className="text-left text-gray-500">
                                        <th className="py-3 px-6 font-medium w-16">#</th>
                                        <th className="py-3 px-6 font-medium">Player</th>
                                        <th className="py-3 px-6 font-medium text-right">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sortedLeaderboard.map((p) => {
                                        const isYou = p.id === userId;
                                        return (
                                            <tr 
                                                key={p.id || p.name} 
                                                className={`transition-colors ${isYou ? 'bg-purple-50/60' : 'bg-white hover:bg-gray-50'}`}
                                            >
                                                <td className="py-4 px-6 font-bold text-gray-400">
                                                    {p.position === 1 ? <Medal className="text-yellow-500" size={20}/> : 
                                                     p.position === 2 ? <Medal className="text-gray-400" size={20}/> :
                                                     p.position === 3 ? <Medal className="text-amber-600" size={20}/> : 
                                                     p.position}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isYou ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                                            {p.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className={`font-medium ${isYou ? 'text-purple-900' : 'text-gray-700'}`}>
                                                            {p.name}
                                                            {isYou && <span className="ml-2 text-[10px] bg-purple-200 text-purple-700 px-1.5 py-0.5 rounded-full">YOU</span>}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right font-bold text-gray-800">
                                                    {p.score}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {sortedLeaderboard.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="py-8 text-center text-gray-400 italic">
                                                No participants yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Side Panel (Stats) */}
                    {!isHost && <div className="space-y-6">
                        <Card className="p-6 bg-white shadow-lg shadow-indigo-100/50 border-0 ring-1 ring-gray-100">
                            <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-purple-500 rounded-full"/>
                                Your Performance
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 text-sm">Rank</span>
                                    <span className="font-bold text-gray-800 text-lg">
                                        {yourStats?.position ? `#${yourStats.position}` : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 text-sm">Score</span>
                                    <span className="font-bold text-purple-600 text-lg">
                                        {yourStats?.score || 0}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-5 text-xs text-gray-500 bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                            <p className="mb-2 font-semibold text-gray-700">What's Next?</p>
                            <p className="leading-relaxed">
                                Wait for the host to restart, or head back to the dashboard to join a new room.
                            </p>
                        </Card>
                    </div> 
                     }
                </div>
            </div>
        </div>
    );
}

export default LeaderBordPage;