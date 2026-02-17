import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/UI/ui";
import Logo from "../components/UI/Logo";
import { UserPlus, Zap, Trophy } from "lucide-react";
import { useAuth } from "../features/auth/useAuth";

const Landing = () => {
  const navigate = useNavigate();
  const { authState, loginAsGuest } = useAuth();
  const { isAuthenticated, role } = authState;

  useEffect(() => {
    if (isAuthenticated && role !== "guest") {
      navigate("/");
    }
  }, [isAuthenticated, role, navigate]);

  const handleInstantDemo = async () => {
    await loginAsGuest();
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] selection:bg-[#FFD028] selection:text-black overflow-x-hidden relative flex flex-col">
      
      {/* ==================== NEW BACKGROUND ELEMENTS ==================== */}
      
     

      {/* 2. Floating Shapes (Visible on Mobile) */}
      <div className="absolute top-20 right-[-10px] md:hidden w-12 h-12 bg-[#FFD028] border-2 border-gray-900 rotate-12 z-0 animate-pulse"></div>
      <div className="absolute bottom-[40%] left-[-10px] md:hidden w-8 h-8 bg-[#8B5CF6] border-2 border-gray-900 -rotate-6 z-0"></div>
      
      {/* 3. Zig Zag (SVG) */}
      <svg className="absolute top-[15%] left-[5%] w-24 h-24 text-gray-300 -z-10 hidden md:block rotate-45" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8">
        <path d="M0 50 L25 25 L50 50 L75 25 L100 50" />
      </svg>

      {/* ==================== HEADER ==================== */}
  <header className="px-6 py-3 z-20 border-b-2 border-gray-900 bg-white/95 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo + Title Group */}
          <button 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate("/welcome")}
          >
            <Logo size="sm" />
            
            {/* THE NEW TITLE */}
            <span className="text-xl md:text-2xl font-bold tracking-tight uppercase">
              Quiz Master
            </span>
          </button>

          <div className="flex gap-3">
             <Button variant="secondary" onClick={() => navigate("/login")} className="hidden sm:flex">Login</Button>
             <Button variant="primary" size="sm" onClick={() => navigate("/signup")}>Sign Up</Button>
          </div>
        </div>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-8 md:gap-12 p-6 items-center relative z-10">
        
        {/* Left Column: Copy & CTAs */}
        <div className="flex flex-col justify-center animate-in slide-in-from-left duration-500 pt-4 md:pt-0">
          
          <div className="inline-block w-fit bg-[#8B5CF6] text-white text-xs md:text-sm font-bold uppercase tracking-wider px-3 py-1 mb-4 border-[1.5px] border-gray-900 -rotate-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)]">
            WelCome....
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-[0.9]">
            Level Up Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD028] to-[#FFD028] style-text-stroke-black relative inline-block mt-1">
              Brain.
              <svg className="absolute inset-x-0 -bottom-2 text-[#FFD028] w-full h-4 md:h-5" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 15 Q 25 5, 50 15 T 100 15" vectorEffect="non-scaling-stroke" stroke="currentcolor" strokeWidth="4" fill="none"/>
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl font-medium text-gray-600 mb-8 leading-relaxed max-w-md border-l-3 border-[#FFD028] pl-4">
            Gamify your learning. Host live battles. Create quizzes in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate("/signup")} variant="primary" styleType="classic" className="text-base px-7 py-3.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] hover:-translate-y-1 transition-all w-full sm:w-auto justify-center">
              <UserPlus size={18} className="mr-2"/> Get Started
            </Button>
            <Button onClick={handleInstantDemo} variant="secondary" styleType="classic" className="text-base px-7 py-3.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] hover:-translate-y-1 transition-all bg-white w-full sm:w-auto justify-center">
              <Zap size={18} className="mr-2"/> Instant Demo
            </Button>
          </div>
          
        </div>

        {/* ************************************ */}
{/* RIGHT COLUMN: The "Topic Galaxy" (Dense Version) */}
        <div className="relative h-[350px] md:h-[500px] w-full items-center justify-center mt-12 md:mt-0 animate-in slide-in-from-right duration-700 hidden md:flex">
           
           {/* Container for the Orbit */}
           <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] flex items-center justify-center">
              
              {/* --- 1. THE CENTER HUB (Logo) --- */}
              <div className="relative z-20 bg-white border-2 border-gray-900 p-6 md:p-8 rounded-full shadow-[5px_5px_0px_0px_rgba(0,0,0,0.6)] hover:scale-110 transition-transform cursor-default">
                 <Logo size="xl" />
              </div>

              {/* --- 2. THE ORBITING TAGS (8 Items) --- */}
              
              {/* Top Center: Science */}
              <div className="absolute -top-4 md:top-0 bg-[#34D399] text-black border-[1.5px] border-gray-900 px-3 py-1 font-bold text-xs uppercase -rotate-6 shadow-sm animate-bounce" style={{animationDuration: '3s'}}>
                 🧬 Science
              </div>

              {/* Top Right: Sports */}
              <div className="absolute top-8 -right-2 md:right-4 bg-[#FFD028] text-black border-[1.5px] border-gray-900 px-3 py-1 font-bold text-xs uppercase rotate-12 shadow-sm animate-bounce" style={{animationDuration: '4.5s'}}>
                 ⚽ Sports
              </div>

              {/* Right Center: History */}
              <div className="absolute top-1/2 -right-8 md:-right-6 -translate-y-1/2 bg-white text-black border-[1.5px] border-gray-900 px-3 py-1 font-bold text-xs uppercase -rotate-3 shadow-sm animate-bounce" style={{animationDuration: '2.5s'}}>
                 🏛️ History
              </div>

              {/* Bottom Right: Movies */}
              <div className="absolute bottom-10 -right-2 md:right-2 bg-[#8B5CF6] text-white border-[1.5px] border-gray-900 px-3 py-1 font-bold text-xs uppercase rotate-6 shadow-sm animate-bounce" style={{animationDuration: '3.8s'}}>
                 🎬 Cinema
              </div>

              {/* Bottom Center: Code */}
              <div className="absolute -bottom-4 md:bottom-0 bg-black text-white border-[1.5px] border-white px-3 py-1 font-bold text-xs uppercase -rotate-2 shadow-sm animate-bounce" style={{animationDuration: '5s'}}>
                 {`</> Code`}
              </div>

              {/* Bottom Left: Music */}
              <div className="absolute bottom-8 -left-2 md:left-2 bg-[#F472B6] text-black border-[1.5px] border-gray-900 px-3 py-1 font-bold text-xs uppercase rotate-12 shadow-sm animate-bounce" style={{animationDuration: '3.2s'}}>
                 🎵 Music
              </div>

              {/* Left Center: Gaming */}
              <div className="absolute top-1/2 -left-8 md:-left-6 -translate-y-1/2 bg-[#FFD028] text-black border-[1.5px] border-gray-900 px-3 py-1 font-bold text-xs uppercase -rotate-6 shadow-sm animate-bounce" style={{animationDuration: '4.2s'}}>
                 🎮 Gaming
              </div>

              {/* Top Left: Art */}
              <div className="absolute top-10 -left-2 md:left-2 bg-[#8B5CF6] text-white border-[1.5px] border-gray-900 px-3 py-1 font-bold text-xs uppercase rotate-3 shadow-sm animate-bounce" style={{animationDuration: '2.8s'}}>
                 🎨 Art
              </div>

           </div>

           {/* 3. Floating "Trophy" Icon (Victory/Gamification) */}
           <div className="absolute -bottom-6 -right-2 md:right-8 bg-white border-2 border-gray-900 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] -rotate-12 hover:rotate-0 transition-transform z-30">
              <Trophy size={32} className="text-[#FFD028] fill-[#FFD028]" />
           </div>

        </div>
        {/* ************************************ */}


      </main>
    </div>
  );
};

export default Landing;