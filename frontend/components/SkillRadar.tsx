"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";

interface SkillItem {
  name: string;
  current: number; // 0 - 100
  target: number;  // 0 - 100
  category: "Languages" | "Frameworks" | "Architecture" | "Tools";
}

const defaultSkills: SkillItem[] = [
  { name: "TypeScript / JS", current: 85, target: 90, category: "Languages" },
  { name: "React & Next.js", current: 80, target: 85, category: "Frameworks" },
  { name: "System Design", current: 45, target: 75, category: "Architecture" },
  { name: "Docker & CI/CD", current: 40, target: 70, category: "Tools" },
  { name: "PostgreSQL & ORMs", current: 75, target: 80, category: "Languages" },
  { name: "DSA / LeetCode", current: 65, target: 85, category: "Architecture" },
];

export default function SkillRadar({ skills = defaultSkills }: { skills?: SkillItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Languages", "Frameworks", "Architecture", "Tools"];

  const filtered = activeCategory === "All" 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

  // Calculate radar polygon points
  const size = 260;
  const center = size / 2;
  const radius = 95;
  const total = skills.length;

  const getCoordinates = (index: number, valuePercent: number) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (valuePercent / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const currentPoints = skills
    .map((s, i) => {
      const { x, y } = getCoordinates(i, s.current);
      return `${x},${y}`;
    })
    .join(" ");

  const targetPoints = skills
    .map((s, i) => {
      const { x, y } = getCoordinates(i, s.target);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Skill Competency Radar
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Benchmark: Full Stack SDE
            </span>
          </h3>
          <p className="text-xs text-slate-400">Comparing your profile against 1,200+ selected interns</p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white font-medium shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Radar Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <svg width={size} height={size} className="overflow-visible">
            {/* Concentric Web Rings */}
            {[0.25, 0.5, 0.75, 1].map((scale, idx) => (
              <circle
                key={idx}
                cx={center}
                cy={center}
                r={radius * scale}
                fill="none"
                stroke="#334155"
                strokeDasharray="3 3"
                strokeWidth="1"
                opacity={0.6}
              />
            ))}

            {/* Axis Lines & Labels */}
            {skills.map((skill, i) => {
              const { x, y } = getCoordinates(i, 100);
              const labelPos = getCoordinates(i, 118);
              return (
                <g key={skill.name}>
                  <line
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[9px] fill-slate-400 font-medium"
                  >
                    {skill.name.split(" ")[0]}
                  </text>
                </g>
              );
            })}

            {/* Target Area Polygon (Dotted Cyan) */}
            <polygon
              points={targetPoints}
              fill="rgba(6, 182, 212, 0.12)"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />

            {/* Current Area Polygon (Glowing Indigo) */}
            <polygon
              points={currentPoints}
              fill="rgba(99, 102, 241, 0.3)"
              stroke="#818cf8"
              strokeWidth="2"
            />

            {/* Vertices */}
            {skills.map((s, i) => {
              const cur = getCoordinates(i, s.current);
              return (
                <circle
                  key={i}
                  cx={cur.x}
                  cy={cur.y}
                  r="3.5"
                  fill="#818cf8"
                  className="transition-all hover:scale-150 cursor-pointer"
                />
              );
            })}
          </svg>

          {/* Chart Legend */}
          <div className="flex items-center gap-5 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-indigo-500/40 border border-indigo-400" />
              <span className="text-slate-300">Your Current Level</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-cyan-500/20 border border-cyan-400 border-dashed" />
              <span className="text-slate-400">Target Role Benchmark</span>
            </div>
          </div>
        </div>

        {/* Skill Gap Progress Bars & Delta */}
        <div className="lg:col-span-7 space-y-3.5">
          {filtered.map((skill) => {
            const gap = skill.target - skill.current;
            const isCritical = gap >= 25;

            return (
              <div
                key={skill.name}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{skill.name}</span>
                    {isCritical ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                        <AlertCircle className="w-2.5 h-2.5" /> High Gap (-{gap}%)
                      </span>
                    ) : gap <= 5 ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-medium">
                        Moderate (-{gap}%)
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    <span className="text-indigo-400 font-bold">{skill.current}%</span> / {skill.target}%
                  </div>
                </div>

                {/* Overlaid Progress Bar */}
                <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  {/* Benchmark target marker */}
                  <div
                    className="absolute top-0 bottom-0 bg-cyan-500/30 rounded-full"
                    style={{ width: `${skill.target}%` }}
                  />
                  {/* Current progress */}
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isCritical ? "bg-rose-500" : "bg-gradient-to-r from-indigo-500 to-indigo-400"
                    }`}
                    style={{ width: `${skill.current}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
