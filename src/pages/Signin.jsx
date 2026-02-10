import React, { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button, Card, Input, StickyNote, Icons } from "../components/UI/ui";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

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
      setDisabled(true
      );

    }

  }, [formData]);

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser({ email: formData.email, password: formData.password });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] selection:bg-[#F472B6] selection:text-white flex items-center justify-center p-4 overflow-hidden">
       
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-5xl w-full">
        
        {/* Left Side: Login Card */}
        <div className="w-full max-w-md relative z-10">
          <Card
            title="Welcome Back"
            styleType="classic"
            className="bg-white w-full"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#4ADE80] border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Icons.User />
              </div>
            </div>
          <form onSubmit={handleLogin}>
            <Input
              label="Email Address"
              icon={Mail}
              styleType="classic"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <Input
              label="Password"
              icon={Lock}
              type="password"
              styleType="classic"
              placeholder="•••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <Button
              isLoading={loading}
              type="submit"
              className="w-full mt-6"
              styleType="classic"
              variant="primary"
              disabled={disabled || loading} 
            >
              AUTHENTICATE
            </Button>

          </form>


          </Card>
        </div>

        
        <div className="relative group w-full md:w-80 flex-shrink-0">
          <StickyNote rotate="rotate-6" className="bg-[#FF6B6B] text-black">
            <h3 className="text-2xl font-black uppercase mb-2 leading-none">
              New Player?
            </h3>
            <p className="text-sm font-medium mb-4 opacity-90 leading-tight">
              Don't have an ID card yet? Get registered to join the quiz!
            </p>

            <button
              onClick={() => navigate("/signup")}
              className="
                        bg-white text-black px-4 py-2 font-bold text-sm border-2 border-black 
                        shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] 
                        hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] 
                        transition-all flex items-center gap-2 mx-auto
                    "
            >
              Create Account <ArrowRight size={16} />
            </button>
          </StickyNote>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;