import { useForm } from "react-hook-form";
import { UserCheck, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const CreateAgent = ({
  isOpen,
  onClose,
  onAgentAdded,
  isSubmitting,
  setIsSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      mobileNumber: "",
      password: "",
    },
  });

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    const apiToastId = toast.loading("Provisioning new agent record...");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${backendUrl}/agents`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Agent profile provisioned successfully!", {
          id: apiToastId,
        });
        reset();
        onAgentAdded();
        onClose();
      }
    } catch (error) {
      console.error("Agent registration lifecycle crash:", error);
      const serverMessage =
        error.response?.data?.message ||
        "Validation constraint error encountered.";
      toast.error(serverMessage, { id: apiToastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0e1422] border border-slate-900 rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-900">
          <UserCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Create Agent Profile</h3>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Full Identity Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              disabled={isSubmitting}
              className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors text-slate-200 ${
                errors.name
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-slate-800 focus:border-emerald-500"
              }`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-[10px] text-rose-500 font-mono mt-1 block">
                {errors.name.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Target Contact Email
            </label>
            <input
              type="email"
              placeholder="johndoe@agentflow.io"
              disabled={isSubmitting}
              className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors text-slate-200 ${
                errors.email
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-slate-800 focus:border-emerald-500"
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address structure",
                },
              })}
            />
            {errors.email && (
              <span className="text-[10px] text-rose-500 font-mono mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Mobile String (With Country Code)
            </label>
            <input
              type="text"
              placeholder="+919999999999"
              disabled={isSubmitting}
              className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors text-slate-200 ${
                errors.mobileNumber
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-slate-800 focus:border-emerald-500"
              }`}
              {...register("mobileNumber", {
                required: "Mobile number is required",
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message: "Include valid country code (e.g. +91...)",
                },
              })}
            />
            {errors.mobileNumber && (
              <span className="text-[10px] text-rose-500 font-mono mt-1 block">
                {errors.mobileNumber.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors text-slate-200 ${
                errors.password
                  ? "border-rose-500 focus:border-rose-500"
                  : "border-slate-800 focus:border-emerald-500"
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <span className="text-[10px] text-rose-500 font-mono mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-900 mt-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-linear-to-r from-emerald-400 to-teal-400 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
              Add Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
