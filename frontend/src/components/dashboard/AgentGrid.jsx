import { Mail, Phone, RefreshCw } from "lucide-react";

export const AgentGrid = ({ matrixData, isLoading }) => {
  if (isLoading && matrixData.length === 0) {
    return (
      <div className="w-full bg-[#0e1422]/20 border border-slate-900 rounded-2xl py-20 text-center text-sm text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-slate-600 mb-3" />
        Syncing live data-matrix pipelines...
      </div>
    );
  }

  if (matrixData.length === 0) {
    return (
      <div className="w-full bg-[#0e1422]/20 border border-slate-900 rounded-2xl py-16 text-center text-sm text-slate-500">
        ⚠️ No operational agent contexts found in database cluster. Register
        agents to link file streams.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
      {matrixData.map((node) => (
        <div
          key={node.agentId}
          className="bg-[#0e1422]/60 border border-slate-900 rounded-xl overflow-hidden shadow-xl hover:border-slate-800 transition-colors flex flex-col h-fit max-h-[500px]"
        >
          <div className="p-4 bg-slate-950/60 border-b border-slate-900 relative shrink-0">
            <div className="absolute top-4 right-4 text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
              {node.taskCount} Tasks
            </div>
            <h4 className="font-bold text-sm text-white truncate max-w-30">
              {node.agentName}
            </h4>
            <div className="mt-2 space-y-1 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="truncate">{node.agentEmail}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-500" />
                <span>{node.agentMobile}</span>
              </div>
            </div>
          </div>

          <div className="p-3 flex-1 overflow-y-auto space-y-2 bg-slate-950/20 scrollbar-thin">
            {node.tasks.length === 0 ? (
              <div className="text-center py-4 text-[11px] text-slate-600 font-mono italic">
                Empty distribution set
              </div>
            ) : (
              node.tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-900 p-2.5 rounded-lg space-y-1 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-200">
                      {task.firstName}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      Row {idx + 1}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400/90 font-mono font-medium">
                    {task.phone}
                  </div>
                  {task.notes && (
                    <p className="text-[10px] text-slate-400 font-sans leading-normal bg-slate-900/50 p-1.5 rounded-md mt-1 border border-slate-900/40">
                      {task.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
