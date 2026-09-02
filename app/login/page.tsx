"use client";

import { IoEye as Eye, IoEyeOff as EyeOff } from "react-icons/io5";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { register } from "@/lib";
import { useAuthStore } from "@/lib/store";
import { fetchUserByProperty } from "@/lib/actions/users.actions";
import { toast } from "sonner";

interface FormInputs {
  userName?: string;
  email: string;
  role: "customer" | "seller";
  password: string;
  confirm?: string;
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const {
    register: reg,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: { role: "customer" },
  });

  const toggleMode = () => {
    // setError("");
    // setSuccessMsg("");
    reset({
      email: "",
      password: "",
      userName: "",
      confirm: "",
      role: "customer",
    });
    setIsLogin(!isLogin);
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    // setError("");
    // setSuccessMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false, // Prevents automatic redirect so we can handle errors
        });

        if (result?.error) {
          // setError("Invalid credentials. Please try again.");
          toast.error("Invalid credentials. Please try again.");
          return;
        }
        // console.log("user before fetchUserByProperty");
        const userData = await fetchUserByProperty({
          prop: "email",
          value: data.email,
        });
        if (!userData.success) {
          // setError(userData.error);
          toast.error(userData.error);
          return;
        }
        // console.log("user logged in: ", userData.data);
        useAuthStore.getState().setCurrentUser(userData.data);
        // const user1 = useAuthStore.getState().currentUser;
        // console.log("user1 in the login page: ", user1);
        // setSuccessMsg("Successfully logged in!");
        toast.success("Successfully logged in!");
        router.push("/");
      } else {
        // --- REGISTRATION FLOW ---
        const regResult = await register({
          email: data.email,
          password: data.password,
          userName: data.userName || "",
          role: data.role ?? "customer",
        });

        if (!regResult.success) {
          // setError(regResult.error ?? "Registration failed.");
          toast.error(regResult.error ?? "Registration failed.");
          return;
        }

        // Auto-login after successful registration
        const autoSignIn = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (autoSignIn?.error) {
          // setError("Account created, but failed to automatically log in.");
          toast.error("Account created, but failed to automatically log in.");
          return;
        }
        useAuthStore.getState().setCurrentUser(regResult.data);
        const user1 = useAuthStore.getState().currentUser;
        // console.log("user1 in the register page: ", user1);
        // setSuccessMsg("Successfully registered!");
        toast.success("Successfully registered!");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      // setError("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Shared Tailwind helper class for fields that fade and shrink away during Login
  const registerFieldClass = `transition-all delay-200 duration-100 ease-in-out origin-top ${
    isLogin
      ? "max-h-0 opacity-0 pointer-events-none scale-95 mb-0 overflow-hidden"
      : "max-h-[100px] opacity-100 mb-4"
  }`;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-150 flex">
      {/* Dark Info Panel */}
      <div
        className={`hidden md:flex absolute top-0 w-1/2 h-full bg-[#211C24] text-white flex-col justify-center px-16 z-10 transition-transform duration-700 ease-in-out ${isLogin ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="relative h-64 w-full">
          <div className="relative m-auto bottom-10 w-48 h-15">
            <Image
              fill
              src="/assets/images/login-logo.png"
              alt="Cyber Logo"
              style={{
                objectFit: "contain",
              }}
            />
          </div>
          <div
            className={`absolute top-20 inset-0 transition-opacity duration-500 ease-in-out ${isLogin ? "opacity-100 delay-300" : "opacity-0 pointer-events-none"}`}
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">
              All-in-One E-Commerce Made Easy.
            </h2>
            <p className="text-gray-300 leading-relaxed text-center">
              From product management to order tracking, our platform helps you
              run your online business smoothly and effectively.
            </p>
          </div>
          <div
            className={`absolute top-20 inset-0 transition-opacity duration-500 ease-in-out ${!isLogin ? "opacity-100 delay-300" : "opacity-0 pointer-events-none"}`}
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Join Our Community Today.
            </h2>
            <p className="text-gray-300 leading-relaxed text-center">
              Set up your store or start shopping with thousands of vendors.
              Experience a new way of e-commerce.
            </p>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div
        className={`w-full md:absolute md:top-0 md:w-1/2 min-h-screen overflow-y-auto bg-white transition-transform duration-700 ease-in-out ${isLogin ? "md:translate-x-full" : "md:translate-x-0"} flex flex-col justify-center px-8 md:px-16 py-12 z-0`}
      >
        <div className="max-w-md w-full mx-auto relative">
          <div className="text-center mb-8 relative h-15">
            <div
              className={`absolute w-full top-0 transition-opacity duration-500 ease-in-out ${isLogin ? "opacity-100 delay-300" : "opacity-0 pointer-events-none"}`}
            >
              <h3 className="text-2xl font-bold text-gray-900">Welcome Back</h3>
              <p className="text-gray-500 text-sm mt-1">
                Please login to your account
              </p>
            </div>
            <div
              className={`absolute w-full top-0 transition-opacity duration-500 ease-in-out ${!isLogin ? "opacity-100 delay-300" : "opacity-0 pointer-events-none"}`}
            >
              <h3 className="text-2xl font-bold text-gray-900">
                Create Account
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Fill in the details to get started
              </p>
            </div>
          </div>

          {/* {(error || successMsg) && (
            <div
              className={`border px-4 py-3 rounded-lg text-sm mb-5 transition-all ${error ? "bg-red-50 border-red-200 text-red-600" : "bg-green-50 border-green-200 text-green-700"}`}
            >
              {error || successMsg}
            </div>
          )} */}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name (Fades Out) */}
            <div className={registerFieldClass}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                {...reg("userName", {
                  required: !isLogin && "Name is required",
                })}
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none"
              />
              {errors.userName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.userName.message}
                </p>
              )}
            </div>

            {/* Email Address (Always Visible) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                {...reg("email", {
                  required: "Email is required",
                  pattern: isLogin
                    ? undefined
                    : { value: /^\S+@\S+$/i, message: "Invalid email format" },
                })}
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Account Type (Fades Out) */}
            <div className={registerFieldClass}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3 h-10.5">
                <button
                  type="button"
                  onClick={() => setValue("role", "customer")}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all duration-300 h-full ${
                    watch("role") === "customer"
                      ? "bg-gray-950 border-gray-950 text-white shadow-md"
                      : "bg-white border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setValue("role", "seller")}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all duration-300 h-full ${
                    watch("role") === "seller"
                      ? "bg-gray-950 border-gray-950 text-white shadow-md"
                      : "bg-white border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                  }`}
                >
                  Seller
                </button>
              </div>
            </div>

            {/* Password (Always Visible) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  {...reg("password", {
                    required: "Password is required",
                    pattern: isLogin
                      ? undefined
                      : {
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password (Fades Out) */}
            <div className={registerFieldClass}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                {...reg("confirm", {
                  required: !isLogin && "Please confirm your password",
                  validate: (val) =>
                    isLogin ||
                    val === watch("password") ||
                    "Passwords do not match",
                })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none"
              />
              {errors.confirm && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirm.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#211C24] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 mt-4"
            >
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Creating account..."
                : isLogin
                  ? "Login"
                  : "Sign Up"}
            </button>
          </form>

          {/* Footer Switching Transition */}
          <div className="pt-4 border-t border-gray-100 mt-5 text-center text-sm text-gray-500 relative h-6">
            <span
              className={`absolute w-full left-0 transition-opacity duration-500 ease-in-out ${isLogin ? "opacity-100 delay-300" : "opacity-0 pointer-events-none"}`}
            >
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-gray-900 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </span>
            <span
              className={`absolute w-full left-0 transition-opacity duration-500 ease-in-out ${!isLogin ? "opacity-100 delay-300" : "opacity-0 pointer-events-none"}`}
            >
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-gray-900 font-semibold hover:underline"
              >
                Login
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
