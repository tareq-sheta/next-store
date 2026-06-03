"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { loginUser, registerUser } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { UserRole } from "@/types";

interface LoginFormInputs {
  email: string;
  password: string;
}

interface RegisterFormInputs {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  password: string;
  confirm: string;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sync mode from URL query param
  useEffect(() => {
    setIsLogin(searchParams.get("mode") !== "register");
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const toggleMode = () => {
    setError("");
    resetLogin();
    resetRegister();
    const newMode = isLogin ? "register" : "login";
    router.push("?" + createQueryString("mode", newMode), { scroll: false });
  };

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFormInputs>();

  // Register form
  const {
    register: registerReg,
    handleSubmit: handleRegisterSubmit,
    watch,
    reset: resetRegister,
    formState: { errors: regErrors },
  } = useForm<RegisterFormInputs>({ defaultValues: { role: "customer" } });

  const onLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    setError("");
    setLoading(true);
    try {
      const result = await loginUser(data.email, data.password);
      if (!result.success || !result.user) {
        setError(result.error ?? "Login failed.");
        return;
      }
      setCurrentUser(result.user);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const onRegister: SubmitHandler<RegisterFormInputs> = async (data) => {
    setError("");
    setLoading(true);
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password,
      });
      if (!result.success || !result.user) {
        setError(result.error ?? "Registration failed.");
        return;
      }
      setCurrentUser(result.user);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden md:flex md:w-1/2 bg-[#211C24] text-white flex-col justify-center px-16">
        <h1 className="text-5xl font-bold mb-4">Cyber</h1>
        <div className="w-24 h-1 bg-white mb-6 rounded" />
        <h2 className="text-2xl font-semibold mb-4">
          All-in-One E-Commerce Made Easy.
        </h2>
        <p className="text-gray-300 leading-relaxed mb-10">
          From product management to order tracking, our platform helps you run
          your online business smoothly and effectively.
        </p>
        <div className="relative w-32 h-10">
          <Image
            fill
            src="/assets/images/Logowhite.png"
            alt="Cyber Logo"
            className="object-contain"
          />
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image
                fill
                src="/assets/images/Logo.png"
                alt="Logo"
                className="object-contain"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {isLogin
                ? "Please login to your account"
                : "Fill in the details to get started"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-5">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  {...registerLogin("email", { required: "Email is required" })}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none"
                />
                {loginErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {loginErrors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...registerLogin("password", {
                      required: "Password is required",
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <IoEye /> : <IoEyeOff />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {loginErrors.password.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#211C24] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleRegisterSubmit(onRegister)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  {...registerReg("name", { required: "Name is required" })}
                  placeholder="John Doe"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none"
                />
                {regErrors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {regErrors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...registerReg("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none"
                />
                {regErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {regErrors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (optional)
                </label>
                <input
                  {...registerReg("phone")}
                  placeholder="+1 234 567 8900"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  {...registerReg("role")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...registerReg("password", {
                      required: "Password is required",
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/,
                        message:
                          "8-16 chars, include upper, lower, number & symbol",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <IoEye /> : <IoEyeOff />}
                  </button>
                </div>
                {regErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {regErrors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  {...registerReg("confirm", {
                    required: "Please confirm your password",
                    validate: (val) =>
                      val === watch("password") || "Passwords do not match",
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none"
                />
                {regErrors.confirm && (
                  <p className="text-red-500 text-xs mt-1">
                    {regErrors.confirm.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#211C24] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="text-gray-900 font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
