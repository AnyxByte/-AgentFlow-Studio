import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Users,
  UserPlus,
  Layers,
  LogOut,
  RefreshCw,
} from "lucide-react";
import FileUploader from "../components/dashboard/FileUploader";
import { CreateAgent } from "../components/dashboard/CreateAgent";
import { useNavigate } from "react-router";
import { AgentGrid } from "../components/dashboard/AgentGrid";

export default function Dashboard() {
  const [matrixData, setMatrixData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const activeUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchDashboardMatrix = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/tasks/distributed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setMatrixData(response.data.data);
      }
    } catch (error) {
      console.error("Matrix Sync Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to sync task allocation matrices.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardMatrix();
    } else {
      navigate("/");
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#0b0f19]/80 border-b border-slate-900 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/10">
            A
          </div>
          <div>
            <span className="font-bold text-base tracking-tight block">
              AgentFlow Studio
            </span>
            <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400">
              Admin Environment
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-xs font-medium text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            User context:{" "}
            <span className="text-slate-200 font-semibold">
              {activeUser.name || "System Admin"}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-lg px-3 py-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit Terminal
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <FileUploader onUploadSuccess={fetchDashboardMatrix} />
          </div>

          <div className="bg-[#0e1422]/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-md h-full flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Active Allocation Core
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Task streams map exclusively to active operators. System
                restrictions constrain distribution balancing down to an active
                pool of exactly 5 agents.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 w-full py-3 text-xs font-semibold text-slate-950 bg-linear-to-r from-emerald-400 to-teal-400 rounded-xl hover:opacity-95 flex items-center justify-center gap-2 transition-transform transform active:scale-95 shadow-md shadow-emerald-500/5"
            >
              <UserPlus className="w-4 h-4" />
              New Agent
            </button>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xl font-bold tracking-tight">
                Agent Distribution Grid
              </h2>
            </div>
            <button
              onClick={fetchDashboardMatrix}
              className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Sync Allocated Arrays"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <AgentGrid matrixData={matrixData} isLoading={isLoading} />
        </section>
      </main>

      {isModalOpen && (
        <CreateAgent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          onAgentAdded={fetchDashboardMatrix}
        />
      )}
    </div>
  );
}
