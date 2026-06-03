import { useState } from "react";
import { Menu, X } from "lucide-react";
import CodeBlock from "../components/landing/CodeBlock";
import FAQItem from "../components/landing/FaqItem";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import { Link } from "react-router";

export default function Landing() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 scroll-smooth overflow-x-hidden">
      <div className="hidden sm:block absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden sm:block absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0b0f19]/70 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              A
            </div>
            <span className="font-bold tracking-tight text-xl bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
              AgentFlow<span className="text-emerald-400">.</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link to="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link to="#docs" className="hover:text-white transition-colors">
              Installation
            </Link>
          </nav>

          <Link to="/login">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="hidden md:block px-4 py-2 text-sm font-semibold text-slate-950 bg-linear-to-r from-emerald-400 to-teal-400 rounded-lg hover:opacity-90 shadow-lg shadow-emerald-500/10 transition-all transform active:scale-95"
            >
              Sign In
            </button>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="block md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-[#0d1321] border-b border-slate-800 px-6 py-6 flex flex-col gap-5 shadow-2xl animate-in fade-in slide-in-from-top-5 duration-200">
            <Link
              to="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-300 font-medium text-base hover:text-emerald-400 transition-colors py-1"
            >
              Features
            </Link>
            <Link
              to="#docs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-300 font-medium text-base hover:text-emerald-400 transition-colors py-1"
            >
              Installation
            </Link>
            <Link to="/login">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLoginOpen(true);
                }}
                className="w-full text-center py-3 text-sm font-semibold text-slate-950 bg-linear-to-r from-emerald-400 to-teal-400 rounded-xl"
              >
                Sign In
              </button>
            </Link>
          </div>
        )}
      </header>

      <Hero setIsLoginOpen={setIsLoginOpen} />

      <Features />

      <section
        id="docs"
        className="py-16 md:py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-slate-900"
      >
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            System Installation Blueprint
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Follow these strict directory scripts to activate the operational
            testing environments on your machine.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <CodeBlock
            label="Initialize Stack"
            tag="Terminal Console"
            code={`git clone https://github.com/your-allocation/agentflow\ncd agentflow\n\n# Backend Cluster Config\ncd server && npm install\n\n# Frontend View Engine\ncd ../client && npm install`}
          />
          <CodeBlock
            label="Environmental Context"
            tag="server/.env"
            code={`MONGO_URI=mongodb+srv://admin_root:secure_cluster_pass@atlas.mongodb.net/agentflow\nJWT_SECRET=production_runtime_signed_hash_key_sequence_512\nPORT=5000\nNODE_ENV=development`}
          />
          <CodeBlock
            label="Execution Verification"
            tag="Terminal Console"
            code={`# Fire up Backend API Daemon (Port 5000)\ncd server && npm run dev\n\n# Execute Local Dev Client View (Port 5173)\ncd client && npm run dev`}
          />
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Technical Architecture FAQ
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Deep-dive technical definitions of the evaluation requirements
            mapped into this code challenge.
          </p>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <FAQItem
            question="How does the remainder distribution logic process uneven datasets?"
            answer="The distribution engine reads the total parsed lead index count array length. It executes a clean modulo operation against the active agent collection pool, distributing left-over index values sequentially to starting agents."
          />
          <FAQItem
            question="What strategy isolates data parsing errors inside the upload system?"
            answer="Uploaded multi-part form payloads handle header matching verification explicitly. If column matrices deviate from FirstName, Phone, or Notes, the API isolates and rejects the chunk before pushing changes downstream."
          />
          <FAQItem
            question="Where are the JSON Web Tokens handled securely during dashboard sessions?"
            answer="Tokens are passed via signed API Authorization bearer schemas, verifying that layout views and dynamic table maps populate only during a valid active admin session verification state."
          />
        </div>
      </section>

      <footer className="bg-slate-950 py-8 md:py-10 px-4 sm:px-6 border-t border-slate-900 text-center text-xs text-slate-500 font-mono tracking-wider">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-slate-400 text-sm">
              AgentFlow.
            </span>
          </div>
          <div className="text-center md:text-right text-[10px] sm:text-xs text-slate-600">
            MERN STACK SYSTEMS VERIFICATION INTERFACE · 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
