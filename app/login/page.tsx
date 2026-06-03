// "use client";

// import React, { useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { IoEye as Eye, IoEyeOff as EyeOff } from "react-icons/io5";

// type UserRole = "customer" | "seller";

// interface LoginFormInputs {
//   email: string;
//   password: string;
// }

// interface RegisterFormInputs {
//   name: string;
//   email: string;
//   phone?: string;
//   role: UserRole;
//   password: string;
//   confirm: string;
// }

// // Mock API and Store for standalone preview
// const mockLoginUser = async (e: string, p: string) => {
//   return new Promise<{ success: boolean; user?: any; error?: string }>(
//     (resolve) =>
//       setTimeout(() => {
//         if (e === "test@test.com" && p === "Password123!") {
//           resolve({ success: true, user: { name: "Test User" } });
//         } else {
//           resolve({
//             success: false,
//             error: "Invalid credentials (try test@test.com / Password123!)",
//           });
//         }
//       }, 1000),
//   );
// };

// const mockRegisterUser = async (data: any) => {
//   return new Promise<{ success: boolean; user?: any; error?: string }>(
//     (resolve) =>
//       setTimeout(() => {
//         resolve({ success: true, user: { name: data.name } });
//       }, 1000),
//   );
// };

// export default function LoginPage() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");

//   const toggleMode = () => {
//     setError("");
//     setSuccessMsg("");
//     resetLogin();
//     resetRegister();
//     setIsLogin(!isLogin);
//   };

//   // Login form
//   const {
//     register: registerLogin,
//     handleSubmit: handleLoginSubmit,
//     reset: resetLogin,
//     formState: { errors: loginErrors },
//   } = useForm<LoginFormInputs>();

//   // Register form
//   const {
//     register: registerReg,
//     handleSubmit: handleRegisterSubmit,
//     watch,
//     reset: resetRegister,
//     formState: { errors: regErrors },
//   } = useForm<RegisterFormInputs>({ defaultValues: { role: "customer" } });

//   const onLogin: SubmitHandler<LoginFormInputs> = async (data) => {
//     setError("");
//     setSuccessMsg("");
//     setLoading(true);
//     try {
//       const result = await mockLoginUser(data.email, data.password);
//       if (!result.success) {
//         setError(result.error ?? "Login failed.");
//         return;
//       }
//       setSuccessMsg("Successfully logged in!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRegister: SubmitHandler<RegisterFormInputs> = async (data) => {
//     setError("");
//     setSuccessMsg("");
//     setLoading(true);
//     try {
//       const result = await mockRegisterUser(data);
//       if (!result.success) {
//         setError(result.error ?? "Registration failed.");
//         return;
//       }
//       setSuccessMsg("Successfully registered!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gray-50 flex">
//       {/*
//         Absolute layout for panels to slide past each other on desktop.
//         On mobile, we stack them (or in this case, hide the info panel like the original).
//       */}

//       {/* Dark Info Panel */}
//       <div
//         className={`hidden md:flex absolute top-0 w-1/2 h-full bg-[#211C24] text-white flex-col justify-center px-16 z-10 transition-transform duration-700 ease-in-out ${
//           isLogin ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div
//           className={`transition-all duration-700 delay-100 ${isLogin ? "opacity-100 translate-x-0" : " -translate-x-8"}`}
//         >
//           <h1 className="text-5xl font-bold mb-4">Cyber</h1>
//           <div className="w-24 h-1 bg-white mb-6 rounded" />
//           <h2 className="text-2xl font-semibold mb-4">
//             {isLogin
//               ? "All-in-One E-Commerce Made Easy."
//               : "Join Our Community Today."}
//           </h2>
//           <p className="text-gray-300 leading-relaxed mb-10">
//             {isLogin
//               ? "From product management to order tracking, our platform helps you run your online business smoothly and effectively."
//               : "Set up your store or start shopping with thousands of vendors. Experience a new way of e-commerce."}
//           </p>
//         </div>
//       </div>

//       {}
//       {/* White Form Panel */}
//       <div
//         className={`w-full md:absolute md:top-0 md:w-1/2 min-h-screen overflow-y-auto bg-white transition-transform duration-700 ease-in-out ${
//           isLogin ? "md:translate-x-full" : "md:translate-x-0"
//         } flex flex-col justify-center px-8 md:px-16 py-12 z-0`}
//       >
//         <div className="max-w-md w-full mx-auto">
//           <div className="text-center mb-8">
//             <h3 className="text-2xl font-bold text-gray-900 transition-all duration-300">
//               {isLogin ? "Welcome Back" : "Create Account"}
//             </h3>
//             <p className="text-gray-500 text-sm mt-1 transition-all duration-300">
//               {isLogin
//                 ? "Please login to your account"
//                 : "Fill in the details to get started"}
//             </p>
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-5 animate-in fade-in slide-in-from-top-2">
//               {error}
//             </div>
//           )}

//           {successMsg && (
//             <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-5 animate-in fade-in slide-in-from-top-2">
//               {successMsg}
//             </div>
//           )}

//           <div className="relative">
//             {}
//             <div
//               className={`transition-all duration-500 absolute w-full top-0 ${isLogin ? "opacity-100 z-10 translate-x-0" : "opacity-0 z-0 -translate-x-8 pointer-events-none"}`}
//             >
//               <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email Address
//                   </label>
//                   <input
//                     {...registerLogin("email", {
//                       required: "Email is required",
//                     })}
//                     type="email"
//                     placeholder="test@test.com"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
//                   />
//                   {loginErrors.email && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {loginErrors.email.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       {...registerLogin("password", {
//                         required: "Password is required",
//                       })}
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password123!"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
//                     </button>
//                   </div>
//                   {loginErrors.password && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {loginErrors.password.message}
//                     </p>
//                   )}
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-[#211C24] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 mt-4"
//                 >
//                   {loading ? "Logging in..." : "Login"}
//                 </button>
//               </form>
//             </div>

//             {}
//             <div
//               className={`transition-all duration-500 ${!isLogin ? "opacity-100 z-10 translate-x-0" : "opacity-0 z-0 translate-x-8 pointer-events-none absolute w-full top-0"}`}
//             >
//               <form
//                 onSubmit={handleRegisterSubmit(onRegister)}
//                 className="space-y-4"
//               >
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Full Name
//                   </label>
//                   <input
//                     {...registerReg("name", { required: "Name is required" })}
//                     placeholder="John Doe"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
//                   />
//                   {regErrors.name && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {regErrors.name.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <input
//                     {...registerReg("email", {
//                       required: "Email is required",
//                       pattern: {
//                         value: /^\S+@\S+$/i,
//                         message: "Invalid email format",
//                       },
//                     })}
//                     type="email"
//                     placeholder="you@example.com"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
//                   />
//                   {regErrors.email && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {regErrors.email.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Phone (optional)
//                   </label>
//                   <input
//                     {...registerReg("phone")}
//                     placeholder="+1 234 567 8900"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Account Type
//                   </label>
//                   <select
//                     {...registerReg("role")}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-gray-400 transition-shadow"
//                   >
//                     <option value="customer">Customer</option>
//                     <option value="seller">Seller</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       {...registerReg("password", {
//                         required: "Password is required",
//                         pattern: {
//                           value:
//                             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/,
//                           message:
//                             "8-16 chars, include upper, lower, number & symbol",
//                         },
//                       })}
//                       type={showPassword ? "text" : "password"}
//                       placeholder="••••••••"
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
//                     </button>
//                   </div>
//                   {regErrors.password && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {regErrors.password.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Confirm Password
//                   </label>
//                   <input
//                     {...registerReg("confirm", {
//                       required: "Please confirm your password",
//                       validate: (val) =>
//                         val === watch("password") || "Passwords do not match",
//                     })}
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
//                   />
//                   {regErrors.confirm && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {regErrors.confirm.message}
//                     </p>
//                   )}
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-[#211C24] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 mt-4"
//                 >
//                   {loading ? "Creating account..." : "Sign Up"}
//                 </button>
//               </form>
//             </div>
//           </div>

//           {}
//           <div
//             className={` pt-4 border-t border-gray-100 ${
//               isLogin ? "mt-70" : "mt-5"
//             }`}
//           >
//             <p className="text-center text-sm text-gray-500">
//               {isLogin
//                 ? "Don't have an account? "
//                 : "Already have an account? "}
//               <button
//                 type="button"
//                 onClick={toggleMode}
//                 className="text-gray-900  font-semibold hover:underline rounded px-1 cursor-pointer"
//               >
//                 {isLogin ? "Sign Up" : "Login"}
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { IoEye as Eye, IoEyeOff as EyeOff } from "react-icons/io5";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
// import { User } from "@/types";
import { IUser } from "@/models/users";
import { login, register } from "@/handlers/users";

// Mocks for lucide-react icons instead of react-icons
// import { Eye, EyeOff } from "lucide-react";

interface LoginFormInputs {
  email: string;
  password: string;
}

interface RegisterFormInputs {
  userName: string;
  email: string;
  phone?: string;
  role: "customer" | "seller";
  password: string;
  confirm: string;
}

// Mock API and Store for standalone preview
const mockLoginUser = async (user: IUser) => {
  return new Promise<{ success: boolean; user?: IUser; error?: string }>(
    (resolve) =>
      setTimeout(() => {
        if (
          user.email === "test@test.com" &&
          user.password === "Password123!"
        ) {
          resolve({ success: true, user: user });
        } else {
          resolve({
            success: false,
            error: "Invalid credentials (try test@test.com / Password123!)",
          });
        }
      }, 1000),
  );
};

const mockRegisterUser = async (user: IUser) => {
  return new Promise<{ success: boolean; user?: IUser; error?: string }>(
    (resolve) =>
      setTimeout(() => {
        resolve({ success: true, user: user });
      }, 1000),
  );
};

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  let router = useRouter();

  const toggleMode = () => {
    setError("");
    setSuccessMsg("");
    resetLogin();
    resetRegister();
    setIsLogin(!isLogin);
  };

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFormInputs>();

  // Register form
  // ---------
  // ---------
  // ---------

  const {
    register: registerReg,
    handleSubmit: handleRegisterSubmit,
    watch,
    reset: resetRegister,
    formState: { errors: regErrors },
  } = useForm<RegisterFormInputs>({ defaultValues: { role: "customer" } });

  // const onLogin: SubmitHandler<LoginFormInputs> = async (data) => {
  //   setError("");
  //   setSuccessMsg("");
  //   setLoading(true);
  //   // console.log(data, "dataaa - login");
  //   try {
  //     // const result = await mockLoginUser(data as User);
  //     let result = await login(data.email, data.password);

  //     if (!result.success) {
  //       setError(result.error ?? "Login failed.");
  //       return;
  //     }
  //     setSuccessMsg("Successfully logged in!");
  //     // useAuthStore.getState().setCurrentUser(result.user as User);
  //     router.push("/");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // -----------
  // -----------
  // -----------
  // type RegData = Omit<User, "id">;
  const onLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const result = await login(data.email, data.password);

      // 1. Check for failure
      if (!result?.success) {
        // Use the exact error message we defined in the API route
        setError(result?.error ?? "Login failed.");
        return;
      }

      // 2. Success!
      setSuccessMsg("Successfully logged in!");

      // 3. Save the user to your store
      // Note: Our API returned `{ data: userWithoutPassword }`, so we access `result.data`
      useAuthStore.getState().setCurrentUser(result.data);

      // 4. Redirect
      router.push("/");
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const onRegister: SubmitHandler<RegisterFormInputs> = async (data) => {
    setError("");
    setSuccessMsg("");
    setLoading(true);
    console.log(data, "dataaa - register");
    try {
      // const result = await mockRegisterUser(data as User);
      // const result = await mockRegisterUser({ ...data, _id: 12 });
      const result = await register(data.email, data.password);
      // let registeredUser: User = {
      //   id: "12",
      //   name: data.userName,
      //   email: data.email,
      //   role: data.role,
      //   phone: data.phone,
      //   password: data.password,
      // };
      if (!result.success) {
        setError(result.error ?? "Registration failed.");
        return;
      }
      setSuccessMsg("Successfully registered!");
      useAuthStore.getState().setCurrentUser(result.data);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 flex">
      {/*
        Absolute layout for panels to slide past each other on desktop.
        On mobile, we stack them (or in this case, hide the info panel like the original).
      */}

      {/* Dark Info Panel */}
      <div
        className={`hidden md:flex absolute top-0 w-1/2 h-full bg-[#211C24] text-white flex-col justify-center px-16 z-10 transition-transform duration-700 ease-in-out ${
          isLogin ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative h-64 w-full">
          {/* Login Mode Content */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              isLogin
                ? "opacity-100 delay-300"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <h1 className="text-5xl font-bold mb-4">Cyber</h1>
            <div className="w-24 h-1 bg-white mb-6 rounded" />
            <h2 className="text-2xl font-semibold mb-4">
              All-in-One E-Commerce Made Easy.
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              From product management to order tracking, our platform helps you
              run your online business smoothly and effectively.
            </p>
          </div>

          {/* Register Mode Content */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              !isLogin
                ? "opacity-100 delay-300"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <h1 className="text-5xl font-bold mb-4">Cyber</h1>
            <div className="w-24 h-1 bg-white mb-6 rounded" />
            <h2 className="text-2xl font-semibold mb-4">
              Join Our Community Today.
            </h2>
            <p className="text-gray-300 leading-relaxed mb-10">
              Set up your store or start shopping with thousands of vendors.
              Experience a new way of e-commerce.
            </p>
          </div>
        </div>
      </div>

      {/* White Form Panel */}
      <div
        className={`w-full md:absolute md:top-0 md:w-1/2 min-h-screen overflow-y-auto bg-white transition-transform duration-700 ease-in-out ${
          isLogin ? "md:translate-x-full" : "md:translate-x-0"
        } flex flex-col justify-center px-8 md:px-16 py-12 z-0`}
      >
        <div className="max-w-md w-full mx-auto relative">
          <div className="text-center mb-8 relative h-[60px]">
            {/* Login Header */}
            <div
              className={`absolute w-full top-0 transition-opacity duration-500 ease-in-out ${isLogin ? "opacity-100 delay-300" : "opacity-0 pointer-events-none"}`}
            >
              <h3 className="text-2xl font-bold text-gray-900">Welcome Back</h3>
              <p className="text-gray-500 text-sm mt-1">
                Please login to your account
              </p>
            </div>
            {/* Register Header */}
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-5 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-5 animate-in fade-in slide-in-from-top-2">
              {successMsg}
            </div>
          )}

          {}
          <div className="grid">
            {/* Login Form */}
            <div
              className={`col-start-1 row-start-1 transition-opacity duration-500 ease-in-out ${isLogin ? "opacity-100 delay-300 z-10" : "opacity-0 z-0 pointer-events-none"}`}
            >
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    {...registerLogin("email", {
                      required: "Email is required",
                    })}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
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
                  className="w-full bg-[#211C24] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 mt-4"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>

            {/* Register Form */}
            <div
              className={`col-start-1 row-start-1 transition-opacity duration-500 ease-in-out ${!isLogin ? "opacity-100 delay-300 z-10" : "opacity-0 z-0 pointer-events-none"}`}
            >
              <form
                onSubmit={handleRegisterSubmit(onRegister)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    {...registerReg("userName", {
                      required: "Name is required",
                    })}
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
                  />
                  {regErrors.userName && (
                    <p className="text-red-500 text-xs mt-1">
                      {regErrors.userName.message}
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <select
                    {...registerReg("role")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-gray-400 transition-shadow"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition-shadow"
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
                  className="w-full bg-[#211C24] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 mt-4"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>

          {}
          {/* Toggle Section */}
          <div className="pt-4 border-t border-gray-100 transition-all duration-500 mt-5">
            <p className="text-center text-sm text-gray-500 relative h-6">
              <span
                className={`absolute w-full left-0 transition-opacity duration-500 ease-in-out ${isLogin ? "opacity-100 delay-300" : "opacity-0 pointer-events-none"}`}
              >
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-gray-900 font-semibold hover:underline rounded px-1 cursor-pointer"
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
                  className="text-gray-900 font-semibold hover:underline rounded px-1 cursor-pointer"
                >
                  Login
                </button>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
