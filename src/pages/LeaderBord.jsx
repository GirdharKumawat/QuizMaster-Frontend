import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import { Trophy, Home, RotateCcw, Medal } from 'lucide-react';

// Fallback demo data
const demoLeaderboard = [
	{ position: 1, name: 'You', score: 420 },
	{ position: 2, name: 'Alice', score: 390 },
	{ position: 3, name: 'Bob', score: 350 },
	{ position: 4, name: 'Charlie', score: 320 },
	{ position: 5, name: 'David', score: 300 },
];

function LeaderBordPage() {
	const { code } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const results = location.state?.results || null;
	const leaderboard = location.state?.leaderboard || demoLeaderboard;
	const yourScore = results?.score ?? leaderboard.find(p => p.name === 'You')?.score ?? 0;
	const totalQuestions = results?.answers?.length || 0;
	const correctCount = results?.answers?.filter(a => a.isCorrect).length || 0;
	const accuracy = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;

	const top3 = leaderboard.slice(0, 3);
	const yourself = leaderboard.find(p => p.name === 'You');
	const maxScore = leaderboard.reduce((m,p)=> p.score>m?p.score:m, 1);
	const medalColors = { 1: 'text-yellow-500', 2: 'text-gray-400', 3: 'text-orange-400' };

	// Simple confetti canvas placeholder (hook for future effect)
	const confettiRef = useRef(null);
	useEffect(() => {
		// Basic burst highlight (placeholder for real confetti lib)
		const canvas = confettiRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		const pieces = Array.from({ length: 60 }).map((_, i) => ({
			x: Math.random() * canvas.width,
			y: -10 - Math.random() * 40,
			r: 4 + Math.random() * 6,
			c: ['#FACC15', '#6366F1', '#EC4899', '#10B981', '#F97316'][i % 5],
			vy: 1 + Math.random() * 2,
			vx: -1 + Math.random() * 2,
			a: 0.6 + Math.random() * 0.4,
		}));
		let frame = 0;
		function tick() {
			frame++;
			ctx.clearRect(0,0,canvas.width,canvas.height);
			pieces.forEach(p => {
				p.x += p.vx;
				p.y += p.vy;
				ctx.globalAlpha = p.a;
				ctx.fillStyle = p.c;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
			});
			if (frame < 240) requestAnimationFrame(tick); // ~4s
		}
		tick();
	}, []);

	return (
		<div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8 overflow-hidden">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.15),transparent_60%)]" />
			<canvas ref={confettiRef} width={1400} height={600} className="absolute top-0 left-1/2 -translate-x-1/2 select-none" />
			<div className="relative max-w-6xl mx-auto space-y-10">
				<header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 animate-fade-in">
					<div className="space-y-1">
						<h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
							<span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg ring-4 ring-white/70"> <Trophy size={28} /> </span>
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Final Leaderboard</span>
						</h1>
						<p className="text-xs md:text-sm text-gray-500 font-mono">Room Code: {code || 'DEMO'}</p>
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

				{/* Podium */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{top3.map(p => (
						<Card
							key={p.position}
							className={`relative p-7 text-center overflow-hidden group animate-slide-up [--delay:${p.position * 80}ms] 
								after:absolute after:inset-0 after:bg-gradient-to-tr after:from-white/20 after:to-transparent after:opacity-0 after:transition-opacity after:duration-300 group-hover:after:opacity-100
								${p.position === 1 ? 'bg-gradient-to-br from-yellow-50 via-amber-100 to-amber-200' : p.position === 2 ? 'bg-gradient-to-br from-gray-50 via-slate-100 to-slate-200' : 'bg-gradient-to-br from-orange-50 via-rose-50 to-rose-100'}`}
						>
							<div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/30 blur-2xl" />
							<div className="relative space-y-3">
								<div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg ring-4 ring-white/60 ${p.position === 1 ? 'bg-yellow-500' : p.position === 2 ? 'bg-gray-500' : 'bg-orange-500'} scale-90 group-hover:scale-100 transition-transform`}>{p.position}</div>
								<h2 className="font-semibold text-gray-800 text-lg tracking-wide">{p.name}</h2>
								<p className="text-sm font-semibold text-purple-700">{p.score} pts</p>
								{p.name === 'You' && <span className="text-[10px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-0.5 rounded-full font-medium shadow">YOU</span>}
							</div>
						</Card>
					))}
				</div>

				{/* Full Table & Stats */}
				<div className="grid gap-8 md:grid-cols-3 items-start">
					<Card className="p-6 md:col-span-2 animate-fade-in [--delay:200ms]">
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">All Players
								<span className="text-xs font-normal text-gray-400">(live)</span>
							</h3>
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
										const percent = (p.score / maxScore) * 100;
										return (
											<tr
												key={p.position}
												className={`relative transition-colors animate-fade-in [--delay:${p.position * 40}ms] ${isYou ? 'bg-gradient-to-r from-purple-50 to-indigo-50' : 'odd:bg-white even:bg-gray-50/40 hover:bg-purple-50/50'}`}
											>
												<td className="py-2 px-3 font-semibold text-gray-700 whitespace-nowrap">
													<div className="flex items-center gap-2">
														<span>{p.position}</span>
														{p.position <= 3 && <Medal size={16} className={medalColors[p.position]} />}
													</div>
												</td>
												<td className="py-2 px-3 font-medium text-gray-800">
													<div className="flex items-center gap-2">
														<span>{p.name}</span>
														{isYou && <span className="text-[10px] bg-purple-200 text-purple-700 px-1.5 py-0.5 rounded-full">YOU</span>}
													</div>
												</td>
												<td className="py-2 px-3 font-semibold text-gray-800">
													<div className="flex items-center gap-3 w-48 max-w-full">
														<span className="tabular-nums w-12">{p.score}</span>
														<div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
															<div
																style={{ width: `${percent}%` }}
																className={`h-full rounded-full ${isYou ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-indigo-400 to-purple-400'} transition-all`}
															/>
														</div>
													</div>
												</td>
											</tr>
										);
									})}
									{leaderboard.length === 0 && (
										<tr>
											<td colSpan="3" className="py-8 text-center text-gray-500 text-sm">No players data.</td>
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
								<li className="flex justify-between"><span className="text-gray-500">Correct</span><span className="font-medium">{correctCount}/{totalQuestions}</span></li>
								<li className="flex justify-between"><span className="text-gray-500">Accuracy</span><span className="font-medium">{accuracy}%</span></li>
								<li className="flex justify-between"><span className="text-gray-500">Rank</span><span className="font-medium">{yourself?.position || '—'}</span></li>
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
