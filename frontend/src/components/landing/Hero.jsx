import useCountUp from "../../hooks/useCountUp";
import { Shield, Users, UploadCloud, ArrowRight } from "lucide-react";

export default function Hero({ setIsLoginOpen }) {
  return (
    <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight uppercase max-w-4xl mx-auto mb-6 leading-tight">
        Intelligent Workflow &{" "}
        <span className="bg-linear-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
          Task Distribution
        </span>
      </h1>

      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
        Automate data processing. Securely ingest large-scale customer records
        via bulk CSV uploads and auto-assign them sequentially across
        distributed client handlers.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={() => setIsLoginOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-white text-slate-950 font-semibold rounded-xl shadow-xl shadow-white/5 transition-all transform active:scale-95"
        >
          Access Admin Console <ArrowRight className="w-4 h-4" />
        </button>
        <a
          href="#features"
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold rounded-xl border border-slate-800 transition-colors"
        >
          Explore Capabilities
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20 border border-slate-900 bg-slate-950/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        {[
          {
            n: 5,
            suffix: " Active Channels",
            label: "Sequential Modulo Rules",
            icon: Users,
          },
          {
            n: 3,
            suffix: " Supported Types",
            label: "CSV, XLSX, and XLS Parse Engine",
            icon: UploadCloud,
          },
          {
            n: 100,
            suffix: "% Cryptographic",
            label: "Signed JSON Web Token Validation",
            icon: Shield,
          },
        ].map(({ n, suffix, label, icon: Icon }) => {
          const [val, ref] = useCountUp(n);
          return (
            <div
              key={label}
              ref={ref}
              className="p-4 flex flex-col items-center text-center"
            >
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-emerald-400 mb-3 shadow-inner">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold tracking-tight text-white font-mono">
                {val}
                {suffix}
              </div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
