import { parseData, EclipseType, EclipseProfile } from "@/utils/eclipse-data";
import { useMemo, useState } from "react";

const getEclipseBadgeStyles = (type: EclipseType) => {
  switch (type) {
    case EclipseType.Total: return 'text-purple-400 font-bold';
    case EclipseType.Annular: return 'text-amber-400 font-bold';
    case EclipseType.Hybrid: return 'text-emerald-400 font-bold';
    case EclipseType.Partial:
    default: return 'text-slate-400';
  }
};

const getEclipseLetter = (type: EclipseType) => {
  switch (type) {
    case EclipseType.Total: return 'T';
    case EclipseType.Annular: return 'A';
    case EclipseType.Hybrid: return 'H';
    case EclipseType.Partial:
    default: return 'P';
  }
};

interface EclipseBrowserProps {
  onEclipseClick: (eclipse: EclipseProfile) => void;
}

export default function EclipseBrowser({ onEclipseClick }: EclipseBrowserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const data: EclipseProfile[] = useMemo(() => parseData(), []);

  return (
    <div className="w-full flex flex-col font-mono selection:bg-cyan-500/30">
      <span className="text-center text-xs bg-slate-900/60 font-medium py-1 tracking-wide">
        Browse eclipses
      </span>

      {isOpen && (
        <div className="w-full border-t border-b border-slate-800/60 my-1 py-1.5 max-h-40 overflow-y-auto pr-0.5 flex flex-col gap-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent animate-fadeIn">
          {data && data.length > 0 ? (
            data.map((eclipse) => {
              const dateObj = new Date(eclipse.datetime);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
              });
              const formattedTime = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              });

              return (
                <div
                  key={eclipse.nasaCatalogNumber}
                  className="flex items-center justify-between text-[11px] bg-slate-900/40 border border-slate-800/40 rounded px-2 py-1 hover:bg-slate-900 hover:border-slate-700/50 transition-all duration-100 group"
                  onClick={() => onEclipseClick(eclipse)}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded bg-slate-950 border border-slate-800/80 ${getEclipseBadgeStyles(eclipse.type)}`}
                      title={EclipseType[eclipse.type]}
                    >
                      {getEclipseLetter(eclipse.type)}
                    </span>
                    <span className="text-slate-300 group-hover:text-white transition-colors">
                      {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500">
                    <span>{formattedTime}</span>
                    <span className="text-[10px] text-cyan-600/80 group-hover:text-cyan-400 transition-colors font-sans">
                      {eclipse.duration}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-2 text-[11px] text-slate-600">
              No active records
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-4 mt-0.5 flex items-center justify-center bg-slate-900/60 hover:bg-slate-900 rounded border border-slate-800/50 hover:border-slate-700/80 text-slate-400 hover:text-cyan-400 cursor-pointer transition-all duration-150 group shadow-sm"
        title={isOpen ? "Collapse list" : "Expand list"}
      >
        <svg
          className={`w-3 h-3 transform transition-transform duration-200 text-slate-400 group-hover:text-cyan-400 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
