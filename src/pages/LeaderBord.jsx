import React, { useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import { Trophy, Home, RotateCcw, Medal } from 'lucide-react';

import { useQuiz } from '../features/quiz/useQuiz';
import { useAuth } from '../features/auth/useAuth';


// This page now reads live data from location.state (no demo data)

function LeaderBordPage() {
	const { quizid } = useParams();
	const { quizState ,getCretedQuizzes,getEnrolledQuizzes } = useQuiz();
	const { authState } = useAuth();
	const navigate = useNavigate();

	const quizzes = [...quizState.createdQuizzes, ...quizState.enrolledQuizzes];
	const currQuiz = quizzes.find((q) => q._id === quizid) || {};



	const leaderboard = (currQuiz.participants || [])
		.map((p, index) => ({
			position: index + 1,
			name: p.username,
			score: p.score,
		}))
		.sort((a, b) => b.score - a.score);
	const yourScore = leaderboard.find(p => p.name === authState.username)?.score || 0;

	console.log("Leaderboard data:", { quizid, currQuiz, leaderboard, yourScore });


	useEffect(() => {
		
		if(!quizzes.length&& quizState.canTry) {
			// fetch quizzes if not already loaded
			getCretedQuizzes();
			getEnrolledQuizzes();
		}


	}, [quizzes]);
	 
	 

	return (
		<div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8 overflow-hidden">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.05),transparent_60%)]" />
			<div className="relative max-w-6xl mx-auto space-y-10">
				<header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 animate-fade-in">
					<div className="space-y-1">
						<h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
							<span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg ring-4 ring-white/70"> <Trophy size={28} /> </span>
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Final Leaderboard</span>
						</h1>
						<p className="text-xs md:text-sm text-gray-500 font-mono">Room Id: {quizid || 'DEMO'}</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button
							variant="secondary"
							onClick={() => navigate('/')}
							className="px-6 py-3 rounded-xl font-semibold shadow-md border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center gap-2 text-base"
						>
							<Home size={18} className="mr-2 text-purple-600" />
							<span className="">Home</span>
						</Button>
						 
						 
					</div>
				</header>

				{/* Simplified header area — podium removed for now */}
				<div className="py-4" />

				{/* Full Table & Stats */}
				<div className="grid gap-8 md:grid-cols-3 items-start">
					<Card className="p-6 md:col-span-2">
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-semibold text-gray-800 text-lg">All Players <span className="text-xs font-normal text-gray-400">(live)</span></h3>
							<span className="text-[11px] uppercase tracking-wide text-gray-400">{leaderboard.length} Entrants</span>
						</div>
						<div className="relative overflow-x-auto -mx-2 rounded-lg ring-1 ring-gray-200/60">
							<table className="min-w-full text-sm relative">
								<caption className="sr-only">Final player rankings</caption>
								<thead>
									<tr className="text-left text-gray-500 border-b bg-white/70 backdrop-blur sticky top-0 z-10">
										<th scope="col" className="py-2 px-3 font-medium">Pos</th>
										<th scope="col" className="py-2 px-3 font-medium">Player</th>
										<th scope="col" className="py-2 px-3 font-medium">Score</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200/70">
									{leaderboard.map(p => {
										const isYou = p.name === 'You';
										return (
											<tr key={p.position} className={`relative ${isYou ? 'bg-gradient-to-r from-purple-50 to-indigo-50' : ''}`}>
												<td className="py-2 px-3 font-semibold text-gray-700 whitespace-nowrap">{p.position}</td>
												<td className="py-2 px-3 font-medium text-gray-800">{p.name}{isYou && <span className="text-[10px] bg-purple-200 text-purple-700 px-1.5 py-0.5 rounded-full ml-2">YOU</span>}</td>
												<td className="py-2 px-3 font-semibold text-gray-800">{p.score}</td>
											</tr>
										);
									})}
									{leaderboard.length === 0 && (
										<tr>
											<td colSpan="3" className="py-8 text-center text-gray-500 text-sm">No player data yet.</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</Card>
					<div className="space-y-6">
						<Card className="p-6 animate-fade-in [--delay:260ms]">
							<h3 className="font-semibold text-gray-800 mb-5">Your Stats</h3>
							<ul className="space-y-3 text-sm">
								<li className="flex justify-between"><span className="text-gray-500">Score</span><span className="font-semibold text-purple-700">{yourScore}</span></li>
								{/* <li className="flex justify-between"><span className="text-gray-500">Correct</span><span className="font-medium">{correctCount}/{totalQuestions}</span></li>
								<li className="flex justify-between"><span className="text-gray-500">Accuracy</span><span className="font-medium">{accuracy}%</span></li> */}
								{/* <li className="flex justify-between"><span className="text-gray-500">Rank</span><span className="font-medium">{yourself?.position || '—'}</span></li> */}
							</ul>
						</Card>
						<Card className="p-5 text-xs text-gray-600 animate-fade-in [--delay:320ms]" variant="subtle">
							<p className="mb-1 font-semibold text-gray-700">Next Steps</p>
							<p>Share your score, rejoin another room, or create a new quiz. Real actions to be wired later.</p>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LeaderBordPage;
