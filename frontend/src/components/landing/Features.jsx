import {
  Shield,
  Users,
  UploadCloud,
  GitMerge,
  Database,
  Layers,
} from "lucide-react";

const Features = () => {
  return (
    <section
      id="features"
      className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-900"
    >
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Core Core Specifications
        </h2>
        <p className="text-slate-400">
          An end-to-end full-stack integration designed around administrative
          control and robust data streaming rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: Shield,
            title: "JWT Secure Pipeline",
            text: "Implements access control layers utilizing stateful request token parsing and cryptographically signed user validation rules.",
          },
          {
            icon: Users,
            title: "Agent Management",
            text: "Create, mutate, and evaluate agent identity datasets containing validation checks for global mobile formatting standards.",
          },
          {
            icon: UploadCloud,
            title: "Streaming CSV Reader",
            text: "Direct file upload parser accepting .csv, .xlsx, and custom extension structures with absolute server sanity checking.",
          },
          {
            icon: GitMerge,
            title: "Modulo Assignment Rule",
            text: "Processes record matrices cleanly through a round-robin engine ($N \\pmod 5$) to maintain equal block assignment structures.",
          },
          {
            icon: Database,
            title: "Mongoose Layer State",
            text: "Highly structured collection references ensure that distributed entries map instantly to specialized dashboard instances.",
          },
          {
            icon: Layers,
            title: "Error Boundaries",
            text: "Defensive formatting parameters shield execution pipelines from running broken data mutations down to MongoDB.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/60 hover:border-slate-700/60 transition-all shadow-lg group hover:-translate-y-1 duration-200"
          >
            <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400 border border-slate-800 shadow-inner group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 mb-5">
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              {item.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
