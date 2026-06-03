import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/20 rounded-xl transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 px-6 text-left text-slate-200 hover:text-white font-medium text-lg transition-colors"
      >
        <span>{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-emerald-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100 pb-5 px-6" : "max-h-0 opacity-0"}`}
      >
        <p className="text-slate-400 text-sm leading-relaxed font-sans">
          {answer}
        </p>
      </div>
    </div>
  );
}
