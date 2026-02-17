import React, { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button, Input, Icons } from "../components/UI/ui";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import Logo from "../components/UI/Logo";

const SigninPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { loginUser,authState } = useAuth();
  const {loading} = authState;
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const { email, password } = formData;
    if (email.trim() && password.trim()) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formData]);

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser({ email: formData.email, password: formData.password });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] selection:bg-[#FFD028] selection:text-black flex flex-col overflow-hidden">

      {/* Header */}
      <header className="px-6 py-3 z-20 border-b-2 border-gray-900 bg-white/95 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/welcome")}>
            <Logo size="sm" />
            <span className="text-xl md:text-2xl font-bold tracking-tight uppercase">Quiz Master</span>
          </button>
          <div className="flex gap-3">
            <Button variant="primary" styleType="classic" onClick={() => navigate("/signup")} className="text-sm">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative">

        {/* Background decorations */}
        <div className="absolute top-20 right-[-10px] md:hidden w-12 h-12 bg-[#8B5CF6] border-2 border-gray-900 rotate-12 z-0 animate-pulse"></div>
        <div className="absolute bottom-[30%] left-[-10px] md:hidden w-8 h-8 bg-[#FFD028] border-2 border-gray-900 -rotate-6 z-0"></div>
        <svg className="absolute top-[20%] right-[5%] w-24 h-24 text-gray-300 -z-10 hidden md:block -rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8">
          <path d="M0 50 L25 25 L50 50 L75 25 L100 50" />
        </svg>
        <svg className="absolute bottom-[15%] left-[8%] w-20 h-20 text-gray-200 -z-10 hidden md:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6">
          <rect x="10" y="10" width="80" height="80" rx="5" />
        </svg>

        <div className="w-full max-w-md relative z-10">

          {/* Title badge */}
          <div className="inline-block w-fit bg-[#8B5CF6] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 mb-4 border-[1.5px] border-gray-900 rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)]">
            Welcome Back
          </div>

          <div className="border-[1.5px] border-gray-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] p-6 md:p-8">

            {/* Card header */}
            <div className="flex items-center justify-between border-b-[1.5px] border-gray-900 pb-2 mb-6">
              <h2 className="text-lg font-bold uppercase tracking-tight text-black">Login</h2>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-400 border border-gray-900"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-gray-900"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 border border-gray-900"></div>
              </div>
            </div>

            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#FFD028] border-[1.5px] border-gray-900 rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]">
                <Icons.User />
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                icon={Mail}
                styleType="classic"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <Input
                label="Password"
                icon={Lock}
                type="password"
                styleType="classic"
                placeholder="•••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />

              <Button
                isLoading={loading}
                type="submit"
                className="w-full mt-6 py-3 bg-[#FFD028] text-black border-[1.5px] border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-sm uppercase"
                styleType="classic"
                variant="primary"
                disabled={disabled || loading}
              >
                AUTHENTICATE
              </Button>
            </form>

            {/* Bottom link */}
            <div className="mt-6 pt-4 border-t-[1.5px] border-gray-200 text-center">
              <p className="text-sm font-medium text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="font-bold text-black underline underline-offset-2 hover:text-[#8B5CF6] transition-colors inline-flex items-center gap-1"
                >
                  Create Account <ArrowRight size={14} />
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SigninPage;