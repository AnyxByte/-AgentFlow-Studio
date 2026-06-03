import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const onSubmit = async (data) => {
    setIsLoading(true);
    const loadingToast = toast.loading("Verifying identity state...");

    try {
      const response = await axios.post(`${backendUrl}/auth/login`, data);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Welcome back, ${user.name || "Admin"}!`, {
        id: loadingToast,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Authentication Error:", error);
      const errorMessage =
        error.response?.data?.message || "Invalid credential parameters.";

      toast.error(errorMessage, {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute top-6 left-4 sm:left-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to core environment
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#0e1422]/60 backdrop-blur-xl border border-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-350">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Console Access
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-70 mx-auto">
            Input system administrator parameters to handle data lists.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400 mb-1.5 font-mono">
              Administrative Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                disabled={isLoading}
                placeholder="admin@agentflow.io"
                {...register("email", {
                  required: "Email parameter is mandatory",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid characters in email configuration string",
                  },
                })}
                className={`w-full pl-10 pr-4 py-3 bg-slate-950/80 border text-slate-200 text-sm rounded-xl focus:outline-none focus:ring-1 transition-all ${
                  errors.email
                    ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30"
                    : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/30"
                }`}
              />
            </div>
            {errors.email && (
              <span className="block text-xs font-medium text-rose-400 mt-1.5 font-sans pl-1">
                ⚠️ {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold tracking-wider uppercase text-slate-400 font-mono">
                Security Key Token
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                placeholder="••••••••••••"
                {...register("password", {
                  required: "Password token string is required",
                  minLength: {
                    value: 6,
                    message: "Tokens must evaluate to at least 6 characters",
                  },
                })}
                className={`w-full pl-10 pr-10 py-3 bg-slate-950/80 border text-slate-200 text-sm rounded-xl focus:outline-none focus:ring-1 transition-all ${
                  errors.password
                    ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30"
                    : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/30"
                }`}
              />
              <button
                type="button"
                tabIndex="-1"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="block text-xs font-medium text-rose-400 mt-1.5 font-sans pl-1">
                ⚠️ {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 text-sm font-semibold text-slate-950 bg-linear-to-r from-emerald-400 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/10 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Secure Session...
              </>
            ) : (
              "Verify Identity Credentials"
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-900 text-center">
          <p className="text-[11px] font-mono text-slate-500 leading-normal max-w-xs mx-auto">
            Evaluation seed defaults:
            <br />
            <span className="text-emerald-500/70">
              admin@agentflow.io
            </span> / <span className="text-emerald-500/70">Admin@123</span>
          </p>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
