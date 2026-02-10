import React, { useEffect, useState } from "react";
import { User, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import { Button, Card, Input, StickyNote, toast } from "../components/UI/ui";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { signupUser, authState } = useAuth();
  const {loading} = authState;
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const { username, email, password, confirmPassword } = formData;
    if (username.trim() && email.trim() && password.trim() && confirmPassword.trim()) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formData]);

  const handleSignup = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error({ title: "Validation Error", detail: "Passwords do not match" });
      return;
    }

    signupUser({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] selection:bg-[#F472B6] selection:text-white flex items-center justify-center p-4 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-6xl w-full">
        
        {/* Left Side: Registration Form Card */}
        <div className="w-full max-w-md relative z-10">
          <Card
            title="Player Registration"
            styleType="classic"
            className="bg-white w-full"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#4ADE80] border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <User size={40} className="text-black" />
              </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                label="Username"
                icon={User}
                styleType="classic"
                placeholder="Pick a username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />

              <Input
                label="Email Address"
                icon={Mail}
                type="email"
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
                placeholder="Create password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
               
              />

              <Input
                label="Confirm Password"
                icon={CheckCircle}
                type="password"
                styleType="classic"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />

              <Button
                  isLoading={loading}
                type="submit"
                className="w-full mt-8"
                styleType="classic"
                variant="primary"
                disabled={disabled || loading}
              >
                CREATE ACCOUNT
              </Button>
            </form>
          </Card>
        </div>

        <div className="relative group w-full md:w-80 flex-shrink-0">
          <StickyNote rotate="-rotate-3" className="bg-[#FFD93D] text-black">
            <h3 className="text-2xl font-black uppercase mb-2 leading-none">
              Join Quickly
            </h3>

            <p className="text-sm font-bold mb-3 text-center">
                Already a Player?
            </p>

            <button
              onClick={() => navigate("/login")}
              className="
                bg-black text-white px-4 py-2 font-bold text-sm border-2 border-black 
                shadow-[3px_3px_0px_0px_rgba(255,255,255,0.5)] 
                hover:bg-gray-800 hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.2)] 
                transition-all flex items-center justify-center gap-2 mx-auto w-full
              "
            >
              Login Here <ArrowRight size={16} />
            </button>
          </StickyNote>

        </div>

      </div>
    </div>
  );
};

export default SignupPage;