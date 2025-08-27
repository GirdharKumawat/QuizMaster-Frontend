import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { Button, Card, Input } from "../components/ui";
import { useNavigate } from "react-router-dom";
const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Mock signup - replace with actual registration
    onSignup({ name: formData.name, email: formData.email });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        <Card className="w-full max-w-md m-auto p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-teal-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Join QuizMaster
            </h1>
            <p className="text-gray-600">
              Create your free account to get started
            </p>
            <p className="text-gray-600">
              Challenge your mind, track your progress, and compete with friends
              — all in one place.
            </p>
          </div>
        </Card>

        <Card className=" m-auto w-full max-w-md p-8">
          <div className="space-y-4 mb-6">
        <Button variant="secondary" className="w-full mb-4" >
        Continue with Google
        </Button>
        <div className="flex mx-auto w-full max-w-xs items-center">
          <div className="h-px flex-grow bg-gray-300" />
          <span className="mx-4 text-sm text-gray-500">or</span>
          <div className="h-px flex-grow bg-gray-300" />
         </div>
        
            <Input
              icon={User}
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              showPasswordToggle={true}
              passwordVisible={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
            <Input
              icon={Lock}
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              showPasswordToggle={true}
              passwordVisible={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
          </div>

          <Button onClick={handleSignup} className="w-full mb-4">
            Create Account
          </Button>

          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <button
              onClick={() => navigate("/login")}
              className="text-purple-600 font-medium hover:underline"
            >
              Sign In
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
