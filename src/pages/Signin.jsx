import React, { useState } from "react";
import { Trophy, Mail, Lock } from "lucide-react";
import { Button, Card, Input, GoogleLoginButton } from "../components/ui";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
const SigninPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const handleLogin = () => {
    // Mock login - replace with actual authentication
    loginUser({ email: formData.email, password: formData.password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-teal-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Trophy className="text-white " size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to continue your quiz journey</p>
        </div>

        <div className="space-y-4 mb-6">
          <Input
            icon={Mail}
            type="email"
            required
            placeholder="Email or Username"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <Input
            icon={Lock}
            required
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <Button onClick={handleLogin} className="w-full mb-4">
          Sign In
        </Button>
        <div className="flex mx-auto w-full max-w-xs items-center">
          <div className="h-px flex-grow bg-gray-300" />
          <span className="mx-4 text-sm text-gray-500">or</span>
          <div className="h-px flex-grow bg-gray-300" />
        </div>
        <Button variant="secondary" className="w-full mb-4" >
        Continue with Google
        </Button>
        {/* <GoogleLoginButton /> */}
        
        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            onClick={() => navigate("/signup")}
            className="text-purple-600 font-medium hover:underline"
          >
            Sign Up
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SigninPage;
