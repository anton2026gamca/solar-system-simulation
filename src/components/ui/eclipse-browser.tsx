import { parseData, EclipseType, EclipseProfile } from "@/utils/eclipse-data";
import { useMemo, useState, useRef, useEffect } from "react";

type EclipseFamily = "Solar" | "Lunar";

interface EclipseTypeMeta {
  label: string;
  family: EclipseFamily;
  short: string;
  badgeClass: string;
  familyClass: string;
}

const DEFAULT_META: EclipseTypeMeta = {
  label: "Eclipse",
  family: "Solar",
  short: "?",
  badgeClass: "text-slate-400 bg-slate-950/70 border-slate-800/80",
  familyClass: "text-slate-300 bg-slate-950/50 border-slate-800/70",
};

const SOLAR_TYPES: string[] = [
  String(EclipseType.SolarPartial),
  String(EclipseType.SolarAnnular),
  String(EclipseType.SolarTotal),
  String(EclipseType.SolarHybrid),
]

const LUNAR_TYPES: string[] = [
  String(EclipseType.LunarPenumbral),
  String(EclipseType.LunarPartial),
  String(EclipseType.LunarTotal),
]

const ECLIPSE_TYPE_META: Partial<Record<EclipseType, EclipseTypeMeta>> = {
  [EclipseType.SolarPartial]: {
    label: "Solar Partial",
    family: "Solar",
    short: "P",
    badgeClass: "text-orange-300 bg-orange-950/40 border-orange-900/70",
    familyClass: "text-orange-200 bg-orange-950/35 border-orange-900/60",
  },
  [EclipseType.SolarAnnular]: {
    label: "Solar Annular",
    family: "Solar",
    short: "A",
    badgeClass: "text-amber-300 bg-amber-950/40 border-amber-900/70",
    familyClass: "text-amber-200 bg-amber-950/35 border-amber-900/60",
  },
  [EclipseType.SolarTotal]: {
    label: "Solar Total",
    family: "Solar",
    short: "T",
    badgeClass: "text-fuchsia-300 bg-fuchsia-950/40 border-fuchsia-900/70",
    familyClass: "text-fuchsia-200 bg-fuchsia-950/35 border-fuchsia-900/60",
  },
  [EclipseType.SolarHybrid]: {
    label: "Solar Hybrid",
    family: "Solar",
    short: "H",
    badgeClass: "text-emerald-300 bg-emerald-950/40 border-emerald-900/70",
    familyClass: "text-emerald-200 bg-emerald-950/35 border-emerald-900/60",
  },
  [EclipseType.LunarPenumbral]: {
    label: "Lunar Penumbral",
    family: "Lunar",
    short: "Pe",
    badgeClass: "text-sky-300 bg-sky-950/40 border-sky-900/70",
    familyClass: "text-sky-200 bg-sky-950/35 border-sky-900/60",
  },
  [EclipseType.LunarPartial]: {
    label: "Lunar Partial",
    family: "Lunar",
    short: "P",
    badgeClass: "text-indigo-300 bg-indigo-950/40 border-indigo-900/70",
    familyClass: "text-indigo-200 bg-indigo-950/35 border-indigo-900/60",
  },
  [EclipseType.LunarTotal]: {
    label: "Lunar Total",
    family: "Lunar",
    short: "T",
    badgeClass: "text-violet-300 bg-violet-950/40 border-violet-900/70",
    familyClass: "text-violet-200 bg-violet-950/35 border-violet-900/60",
  },
};

const getEclipseMeta = (type: EclipseType) => ECLIPSE_TYPE_META[type] ?? DEFAULT_META;

const getEclipseBadgeStyles = (type: EclipseType) => getEclipseMeta(type).badgeClass;

const getEclipseLetter = (type: EclipseType) => getEclipseMeta(type).short;

interface EclipseBrowserProps {
  onEclipseClick: (eclipse: EclipseProfile) => void;
}

const ROW_HEIGHT = 28;
const VISIBLE_ROWS = 10;
const MAX_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS;

export default function EclipseBrowser({ onEclipseClick }: EclipseBrowserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [scrollTop, setScrollTop] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const rawData: EclipseProfile[] = useMemo(() => parseData(), []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [searchQuery, selectedType]);

  const filteredData = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery && selectedType === "ALL") return rawData;

    const normalizeTimeStr = (str: string) => str.replace(/\b0+(\d+)/g, "$1").toLowerCase();
    const normalizedQuery = normalizeTimeStr(cleanQuery);

    return rawData.filter((eclipse) => {
      if (
        selectedType !== "ALL" &&
        String(eclipse.type) !== selectedType &&
        !(selectedType === "Solar" && SOLAR_TYPES.includes(String(eclipse.type))) &&
        !(selectedType === "Lunar" && LUNAR_TYPES.includes(String(eclipse.type)))
      ) {
        return false;
      }

      if (!normalizedQuery) return true;

      const meta = getEclipseMeta(eclipse.type);
      const dateObj = new Date(eclipse.datetime);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).toLowerCase();

      const rawTime = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const normalizedTime = normalizeTimeStr(rawTime);
      const normalizedDuration = normalizeTimeStr(eclipse.duration);
      const typeText = `${meta.family} ${meta.label}`.toLowerCase();

      return (
        normalizedTime.includes(normalizedQuery) ||
        normalizedDuration.includes(normalizedQuery) ||
        formattedDate.includes(normalizedQuery) ||
        typeText.includes(normalizedQuery)
      );
    });
  }, [rawData, searchQuery, selectedType]);

  const totalItems = filteredData.length;
  const totalHeight = totalItems * ROW_HEIGHT;

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 2);
  const endIndex = Math.min(totalItems - 1, Math.floor((scrollTop + MAX_HEIGHT) / ROW_HEIGHT) + 2);

  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      if (filteredData[i]) {
        items.push({ item: filteredData[i], index: i });
      }
    }
    return items;
  }, [filteredData, startIndex, endIndex]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div className="w-full flex flex-col font-mono selection:bg-cyan-500/30">
      <span className="text-center text-xs bg-slate-900/60 font-medium py-1 tracking-wide">
        Browse eclipses ({totalItems})
      </span>

      {isOpen && (
        <div className="flex gap-1.5 p-1 bg-slate-950/40 border-b border-slate-900">
          <input
            type="text"
            placeholder="Search by date, time, duration, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-slate-900/80 border border-slate-800 text-[11px] px-2 py-1 rounded text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-700 transition-colors"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-900/80 border border-slate-800 text-[11px] px-1 py-1 rounded text-slate-400 focus:outline-none focus:border-cyan-700 cursor-pointer"
          >
            <option value="ALL">All Eclipses</option>
            <optgroup label="Solar">
              <option value={"Solar"}>All Solar</option>
              <option value={String(EclipseType.SolarPartial)}>Solar Partial</option>
              <option value={String(EclipseType.SolarAnnular)}>Solar Annular</option>
              <option value={String(EclipseType.SolarTotal)}>Solar Total</option>
              <option value={String(EclipseType.SolarHybrid)}>Solar Hybrid</option>
            </optgroup>
            <optgroup label="Lunar">
              <option value={"Lunar"}>All Lunar</option>
              <option value={String(EclipseType.LunarPenumbral)}>Lunar Penumbral</option>
              <option value={String(EclipseType.LunarPartial)}>Lunar Partial</option>
              <option value={String(EclipseType.LunarTotal)}>Lunar Total</option>
            </optgroup>
          </select>
        </div>
      )}

      {isOpen && (
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{ height: totalItems > 0 ? Math.min(totalHeight, MAX_HEIGHT) : 40 }}
          className="w-full border-b border-slate-800/60 overflow-y-auto pr-0.5 relative scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent transition-all duration-150"
        >
          {totalItems > 0 ? (
            <div style={{ height: totalHeight, width: "100%", position: "absolute" }}>
              {visibleItems.map(({ item: eclipse, index }) => {
                const meta = getEclipseMeta(eclipse.type);
                const dateObj = new Date(eclipse.datetime);
                const formattedDate = dateObj.toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                });
                const formattedTime = dateObj.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });

                return (
                  <div
                    key={eclipse.nasaCatalogNumber}
                    style={{
                      position: "absolute",
                      top: index * ROW_HEIGHT,
                      left: 0,
                      right: 0,
                      height: ROW_HEIGHT,
                    }}
                    className="flex items-center justify-between text-[11px] bg-slate-900/40 border border-slate-800/20 rounded px-2 py-0.5 hover:bg-slate-900 hover:border-slate-700/50 transition-all duration-75 group cursor-pointer"
                    onClick={() => onEclipseClick(eclipse)}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`text-[10px] w-4 h-4 flex items-center justify-center rounded border ${getEclipseBadgeStyles(eclipse.type)}`}
                        title={meta.label}
                      >
                        {getEclipseLetter(eclipse.type)}
                      </span>
                      <span className="text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">
                        {formattedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${meta.familyClass}`}>
                        {meta.family}
                      </span>
                      <span>{formattedTime}</span>
                      <span className="text-[10px] text-cyan-600/80 group-hover:text-cyan-400 transition-colors font-sans">
                        {eclipse.duration}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-2 text-[11px] text-slate-600">
              No active records match filters
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
          className={`w-3 h-3 transform transition-transform duration-200 text-slate-400 group-hover:text-cyan-400 ${isOpen ? "rotate-180" : ""}`}
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
