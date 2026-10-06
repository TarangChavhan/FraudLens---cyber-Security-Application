import React, { useState, useMemo } from 'react';
import {
  Flame,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  TrendingDown,
  X,
  Search,
  Users,
  Percent,
  FileText,
  MapPin,
  Info,
} from 'lucide-react';
import {
  INDIA_STATES_DATA,
  ALL_INDIA_TOTAL,
  StateCrimeRecord,
} from '../data/indiaCrimeData';

export default function IndiaCrimeMap() {
  const [selectedStateId, setSelectedStateId] = useState<string>('up'); // Default to UP like reference image
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<'2020' | '2021' | '2022'>('2022');
  const [rateFilter, setRateFilter] = useState<'all' | 'high' | 'med' | 'low'>('all');
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Selected state object (or All India if 'all')
  const currentRecord: StateCrimeRecord = useMemo(() => {
    if (!selectedStateId || selectedStateId === 'all') {
      return ALL_INDIA_TOTAL;
    }
    return (
      INDIA_STATES_DATA.find((s) => s.id === selectedStateId) || ALL_INDIA_TOTAL
    );
  }, [selectedStateId]);

  // Hovered state record for tooltip
  const hoveredRecord = useMemo(() => {
    if (!hoveredStateId) return null;
    return INDIA_STATES_DATA.find((s) => s.id === hoveredStateId) || null;
  }, [hoveredStateId]);

  // Calculate year metrics
  const getCasesForYear = (rec: StateCrimeRecord, yr: '2020' | '2021' | '2022') => {
    if (yr === '2020') return rec.cases2020;
    if (yr === '2021') return rec.cases2021;
    return rec.cases2022;
  };

  const currentCases = getCasesForYear(currentRecord, selectedYear);
  const prevCases = currentRecord.cases2021;
  const yoyChange =
    prevCases > 0
      ? (((currentRecord.cases2022 - prevCases) / prevCases) * 100).toFixed(1)
      : '0.0';
  const isPositiveGrowth = Number(yoyChange) >= 0;

  // National Share of total 2022 crimes
  const nationalShare =
    ALL_INDIA_TOTAL.cases2022 > 0 && currentRecord.id !== 'all'
      ? ((currentRecord.cases2022 / ALL_INDIA_TOTAL.cases2022) * 100).toFixed(1)
      : '100.0';

  // Convert crime rate per 1 Lakh (100,000 citizens) to Percentage of population
  // E.g. 171.6 per 100,000 = (171.6 / 100,000) * 100 = 0.17%
  const toCrimeRatePercent = (rate: number) => {
    return (rate / 1000).toFixed(2);
  };

  const currentCrimeRatePercent = toCrimeRatePercent(currentRecord.crimeRate2022);
  const nationalCrimeRatePercent = toCrimeRatePercent(ALL_INDIA_TOTAL.crimeRate2022);

  // Category determination for legend/filter
  const getRateCategory = (rate: number): 'high' | 'med' | 'low' => {
    if (rate >= 300) return 'high';
    if (rate >= 150) return 'med';
    return 'low';
  };

  // Color mapping based on crime rate
  const getStateColor = (state: StateCrimeRecord) => {
    const isSelected = selectedStateId === state.id;
    const isHovered = hoveredStateId === state.id;

    if (isSelected) return '#1d528b'; // Highlighted blue like in image
    if (isHovered) return '#2563eb';

    const cat = getRateCategory(state.crimeRate2022);
    if (rateFilter !== 'all' && rateFilter !== cat) {
      return '#061628'; // Dimmed
    }

    if (cat === 'high') return '#163558';
    if (cat === 'med') return '#0e2744';
    return '#091c33';
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <section className="py-16 px-4 sm:px-6 bg-[#040c16] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Main Dashboard Box */}
        <div className="bg-[#071322] border border-[#163353] rounded-2xl p-4 sm:p-7 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#142d4a]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>India Crime & Safety Map (Official State Data)</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Explore reported crimes, crime rates, and police action across every state in India
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="hidden md:inline">Click any state on map to see details</span>
              {/* Year Selector */}
              <div className="inline-flex rounded-lg bg-[#040e1b] border border-[#17385d] p-0.5" title="Choose year to view">
                {(['2022', '2021', '2020'] as const).map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Year {yr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Grid: Left Map + Right Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: Map Container (7 Cols on LG) */}
            <div className="lg:col-span-7 bg-[#040d18] border border-[#122842] rounded-xl p-4 sm:p-5 relative flex flex-col justify-between min-h-[580px] shadow-inner">
              {/* Active Filter Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 z-10">
                {selectedStateId && selectedStateId !== 'all' ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1f36] border border-amber-500/70 text-xs text-white shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.9)]" />
                    <span className="font-medium text-gray-300">
                      Selected State:{' '}
                      <strong className="text-amber-300 font-bold">
                        {currentRecord.name}
                      </strong>{' '}
                      ({formatNumber(currentCases)} Crimes)
                    </span>
                    <button
                      onClick={() => setSelectedStateId('all')}
                      className="ml-1 text-amber-400 hover:text-white transition flex items-center gap-1 text-[11px] font-bold underline cursor-pointer bg-amber-500/10 px-2 py-0.5 rounded"
                      title="Click to show total data for entire country"
                    >
                      Show Whole India
                    </button>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1f36] border border-blue-500/50 text-xs text-white">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="font-medium text-gray-300">
                      Showing: <strong className="text-blue-300 font-bold">All of India Together</strong> (
                      {formatNumber(ALL_INDIA_TOTAL.cases2022)} Total Crimes)
                    </span>
                  </div>
                )}

                {/* State Quick Dropdown */}
                <select
                  value={selectedStateId}
                  onChange={(e) => setSelectedStateId(e.target.value)}
                  className="bg-[#091829] border border-[#1b3d63] text-gray-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer"
                  title="Pick a state from the list"
                >
                  <option value="all">🇮🇳 Whole Country (All India Total)</option>
                  {INDIA_STATES_DATA.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({formatNumber(st.cases2022)} crimes)
                    </option>
                  ))}
                </select>
              </div>

              {/* Vector Map Container */}
              <div
                className="relative flex-1 flex items-center justify-center my-2 select-none overflow-hidden"
                onMouseLeave={() => {
                  setHoveredStateId(null);
                  setTooltipPos(null);
                }}
              >
                {/* Background Grid Pattern (Matching Reference Image) */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="grid-pattern"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="0.5"
                        strokeDasharray="2,4"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>

                {/* India Interactive SVG */}
                <svg
                  viewBox="0 0 612 696"
                  className="w-full h-auto max-h-[520px] drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] z-0"
                >
                  {/* Render All States */}
                  {INDIA_STATES_DATA.map((state) => {
                    const isSelected = selectedStateId === state.id;
                    const fillColor = getStateColor(state);

                    return (
                      <path
                        key={state.id}
                        d={state.path}
                        fill={fillColor}
                        stroke={isSelected ? '#f59e0b' : '#1c4470'}
                        strokeWidth={isSelected ? '2.5' : '0.8'}
                        className="transition-colors duration-150 cursor-pointer"
                        style={{
                          filter: isSelected
                            ? 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.75))'
                            : undefined,
                        }}
                        onClick={() => setSelectedStateId(state.id)}
                        onMouseEnter={(e) => {
                          setHoveredStateId(state.id);
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltipPos({
                            x: state.centroid.x,
                            y: state.centroid.y,
                          });
                        }}
                      />
                    );
                  })}

                  {/* Centroid Pin Marker on Selected State (Matches yellow circle 4 in image!) */}
                  {currentRecord.centroid && currentRecord.id !== 'all' && (
                    <g
                      transform={`translate(${currentRecord.centroid.x}, ${currentRecord.centroid.y})`}
                      className="pointer-events-none transition-transform duration-300"
                    >
                      {/* Outer pulse */}
                      <circle
                        r="18"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        className="animate-ping opacity-75"
                      />
                      {/* Golden background badge */}
                      <circle
                        r="12"
                        fill="#f59e0b"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="shadow-lg"
                      />
                      {/* Marker Number or Initial inside badge */}
                      <text
                        textAnchor="middle"
                        dy="4"
                        fontSize="10"
                        fontWeight="bold"
                        fill="#0b1b2d"
                      >
                        {currentRecord.slNo || '1'}
                      </text>
                    </g>
                  )}
                </svg>

                {/* Floating State Hover Dossier Tooltip */}
                {hoveredRecord && (
                  <div className="absolute top-3 right-3 bg-[#0a1a2e]/95 backdrop-blur-md border border-[#1e4a7a] p-3.5 rounded-xl text-xs pointer-events-none z-20 shadow-xl max-w-xs animate-in fade-in zoom-in-95 duration-100">
                    <p className="font-bold text-amber-300 text-sm mb-1.5 flex items-center gap-1.5">
                      <MapPin size={15} />
                      <span>{hoveredRecord.name}</span>
                    </p>
                    <div className="space-y-1.5 text-gray-300">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">Total Crimes (2022):</span>
                        <span className="font-mono font-bold text-white">
                          {formatNumber(hoveredRecord.cases2022)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">Crime Rate (%):</span>
                        <span className="font-mono font-semibold text-cyan-300">
                          {toCrimeRatePercent(hoveredRecord.crimeRate2022)}% ({hoveredRecord.crimeRate2022} per lakh)
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">Cases Taken to Court:</span>
                        <span className="font-mono font-semibold text-emerald-300">
                          {hoveredRecord.chargesheetingRate2022}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Legend */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#122c4b] text-xs">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[11px] font-semibold text-gray-400">Filter by Crime Rate:</span>
                  <button
                    onClick={() => setRateFilter(rateFilter === 'high' ? 'all' : 'high')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition cursor-pointer text-[11px] font-medium ${
                      rateFilter === 'high'
                        ? 'bg-amber-950/70 border-amber-400 text-amber-300'
                        : 'bg-[#06182c] border-[#18395e] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>High Crime (&gt;0.30% / &gt;300 per lakh)</span>
                  </button>

                  <button
                    onClick={() => setRateFilter(rateFilter === 'med' ? 'all' : 'med')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition cursor-pointer text-[11px] font-medium ${
                      rateFilter === 'med'
                        ? 'bg-blue-950/70 border-blue-400 text-blue-300'
                        : 'bg-[#06182c] border-[#18395e] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Medium Crime (0.15% - 0.30%)</span>
                  </button>

                  <button
                    onClick={() => setRateFilter(rateFilter === 'low' ? 'all' : 'low')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition cursor-pointer text-[11px] font-medium ${
                      rateFilter === 'low'
                        ? 'bg-purple-950/70 border-purple-400 text-purple-300'
                        : 'bg-[#06182c] border-[#18395e] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Low Crime (&lt;0.15%)</span>
                  </button>
                </div>

                <span className="text-[11px] text-gray-400">
                  Data: National Crime Records Bureau (Govt of India)
                </span>
              </div>
            </div>

            {/* RIGHT: 3 Stacked Dossier Cards */}
            <div className="lg:col-span-5 space-y-4">
              {/* CARD 1: Total Crimes Reported */}
              <div className="bg-[#091b2e] border border-[#163659] rounded-xl p-6 shadow-md hover:border-amber-500/40 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-amber-400 tracking-wide">
                      Total Crimes Reported ({selectedYear})
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      All official police complaints & cyber fraud cases
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Flame size={20} />
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-2.5">
                  <span className="text-4xl sm:text-5xl font-black text-amber-300 font-mono tracking-tight">
                    {formatNumber(currentCases)}
                  </span>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    TOTAL CASES
                  </span>
                </div>

                <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                  Total crime incidents registered with police in {selectedYear}{' '}
                  {currentRecord.id !== 'all' ? `across ${currentRecord.name}` : 'across all Indian States & Union Territories'}.
                </p>

                {currentRecord.id !== 'all' && (
                  <div className="mt-4 pt-3 border-t border-[#14304f] flex items-center justify-between text-xs">
                    <span className="text-gray-400">Change compared to 2021:</span>
                    <span
                      className={`font-semibold font-mono flex items-center gap-1 ${
                        isPositiveGrowth ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {isPositiveGrowth ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {isPositiveGrowth ? `+${yoyChange}% increase` : `${yoyChange}% decrease`}
                    </span>
                  </div>
                )}
              </div>

              {/* CARD 2: Crime Rate in Percentage */}
              <div className="bg-[#091b2e] border border-[#163659] rounded-xl p-6 shadow-md hover:border-emerald-500/40 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-emerald-400 tracking-wide">
                      Crime Rate (% of Population)
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Percentage of citizens affected by reported crime
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck size={20} />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-baseline gap-2.5">
                  <span className="text-4xl sm:text-5xl font-black text-emerald-300 font-mono tracking-tight">
                    {currentCrimeRatePercent}%
                  </span>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                    CRIME RATE %
                  </span>
                  <span className="text-[11px] font-mono text-gray-400 bg-[#06182c] px-2 py-0.5 rounded border border-[#16385d]">
                    ({currentRecord.crimeRate2022} per 1 Lakh)
                  </span>
                </div>

                <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                  Approximately <strong className="text-white">{currentCrimeRatePercent}%</strong> of the population reported a crime incident in {currentRecord.name === 'Total All India' ? 'India' : currentRecord.name} (equivalent to {currentRecord.crimeRate2022} crimes per 100,000 citizens). The All-India national average is <strong className="text-white">{nationalCrimeRatePercent}%</strong> (258 per lakh).
                </p>

                <div className="mt-4 pt-3 border-t border-[#14304f] flex items-center justify-between text-xs">
                  <span className="text-gray-400">Compared to National Average:</span>
                  <span
                    className={`font-semibold px-2.5 py-0.5 rounded text-[11px] ${
                      currentRecord.id === 'all'
                        ? 'bg-blue-950/70 text-blue-300 border border-blue-800/50'
                        : currentRecord.crimeRate2022 > ALL_INDIA_TOTAL.crimeRate2022
                        ? 'bg-red-950/70 text-red-300 border border-red-800/50'
                        : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50'
                    }`}
                  >
                    {currentRecord.id === 'all'
                      ? `National Baseline (${nationalCrimeRatePercent}%)`
                      : currentRecord.crimeRate2022 > ALL_INDIA_TOTAL.crimeRate2022
                      ? `+${(Number(currentCrimeRatePercent) - Number(nationalCrimeRatePercent)).toFixed(2)}% Above National Rate`
                      : `${(Number(nationalCrimeRatePercent) - Number(currentCrimeRatePercent)).toFixed(2)}% Safer Than National Rate`}
                  </span>
                </div>
              </div>

              {/* CARD 3: Police Action & State Facts */}
              <div className="bg-[#091b2e] border border-[#163659] rounded-xl p-6 shadow-md hover:border-cyan-500/40 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-cyan-400 tracking-wide">
                      Police Action & State Facts
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Cases solved by police & population details
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <BarChart3 size={20} />
                  </div>
                </div>

                {/* Big Highlight Box: Police Chargesheet Rate */}
                <div className="mt-4 bg-[#051322] border border-[#112a45] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                      Cases Solved by Police (Chargesheet Rate)
                    </p>
                    <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      Taken to Court
                    </span>
                  </div>
                  <p className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono mt-1.5">
                    {currentRecord.chargesheetingRate2022}%
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    In {currentRecord.chargesheetingRate2022}% of cases, police finished their investigation and filed official charges in court.
                  </p>
                </div>

                {/* 2-Column Details Grid */}
                <div className="mt-4 pt-3 border-t border-[#14304f] grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider mb-1.5">
                      State Population
                    </p>
                    <div className="space-y-1 text-gray-300">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-[11px]">Population:</span>
                        <span className="font-mono font-bold text-white text-[11px]">
                          {formatNumber(currentRecord.populationLakhs)} Lakh
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-[11px]">2021 Crimes:</span>
                        <span className="font-mono text-gray-200 text-[11px]">
                          {formatNumber(currentRecord.cases2021)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-cyan-400/90 uppercase tracking-wider mb-1.5">
                      Share of India's Crimes
                    </p>
                    <div className="space-y-1 text-gray-300">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-[11px]">Part of India:</span>
                        <span className="font-mono font-bold text-cyan-300 text-[11px]">
                          {nationalShare}% of total
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-[11px]">2020 Crimes:</span>
                        <span className="font-mono text-gray-200 text-[11px]">
                          {formatNumber(currentRecord.cases2020)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
