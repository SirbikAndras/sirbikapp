import { useState, useTransition } from "react";
import { loginApi } from "../api/apiClient.ts";
import type { LoginRequestDTO } from "../api/generated";
import { JWT_TOKEN_KEY } from "../api/axiosInstance";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Input from "../components/Input";
import LockIcon from "../icons/LockIcon.tsx";
import EyeOffIcon from "../icons/EyeOffIcon.tsx";
import EyeIcon from "../icons/EyeIcon.tsx";
import MailIcon from "../icons/MailIcon.tsx";
import ArrowRightIcon from "../icons/ArrowRightIcon.tsx";
import GoogleIcon from "../icons/GoogleIcon.tsx";
import GitHubIcon from "../icons/GitHubIcon.tsx";

export default function LoginView() {
  const [loginForm, setLoginForm] = useState<LoginRequestDTO>({});
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = () => {
    if (!loginForm.email || !loginForm.password) {
      return;
    }

    startTransition(async () => {
      const response = await loginApi.login(loginForm);
      const token = response.data.token;
      if (token) {
        sessionStorage.setItem(JWT_TOKEN_KEY, token);
        navigate("/");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div className="min-h-screen bg-(--color-bg) flex items-center justify-center p-4">
      <div className="w-100">
        {/* Login Card */}
        <div className="bg-(--color-card) rounded-3xl p-10 shadow-xl flex flex-col gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-[14px] bg-linear-to-br from-(--color-accent) to-(--color-accent-dark) flex items-center justify-center">
              <span className="font-heading text-[28px] font-semibold text-(--color-bg)">
                S
              </span>
            </div>
            <span className="font-heading text-2xl font-medium text-(--color-text-primary)">
              Sirbik App
            </span>
          </div>

          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-heading text-[32px] font-light text-(--color-text-primary)">
              Welcome back
            </h1>
            <p className="font-body text-sm text-(--color-text-secondary)">
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={loginForm.email || ""}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              onKeyDown={handleKeyDown}
              icon={<MailIcon />}
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={loginForm.password || ""}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              onKeyDown={handleKeyDown}
              icon={<LockIcon />}
              rightIcon={
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </span>
              }
            />
          </div>

          {/* Sign In Button */}
          <Button
            variant="primary"
            className="w-full"
            onClick={login}
            disabled={isPending}
            icon={<ArrowRightIcon />}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-(--color-border)" />
            <span className="font-body text-xs text-(--color-text-secondary)">
              or
            </span>
            <div className="flex-1 h-px bg-(--color-border)" />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <GoogleIcon />
              Google
            </Button>
            <Button variant="outline" className="flex-1">
              <GitHubIcon />
              GitHub
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center font-body text-sm text-(--color-text-secondary)">
            Don't have an account?{" "}
            <NavLink
              to="/register"
              className="font-semibold text-(--color-accent) hover:underline"
            >
              Sign up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
