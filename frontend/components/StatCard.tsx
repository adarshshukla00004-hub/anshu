import React from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  color?: "indigo" | "emerald" | "amber" | "cyan" | "rose";
  progress?: number;
}

export default function StatCard({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  color = "indigo",
  progress,
}: StatCardProps) {
  const colorMap = {
    indigo: {
      border: "border-indigo-500/20 hover:border-indigo-500/40",
      bg: "from-indigo-600/10 via-slate-900 to-slate-950",
      iconBg: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
      progressBg: "bg-indigo-500",
      glow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]",
    },
    emerald: {
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      bg: "from-emerald-600/10 via-slate-900 to-slate-950",
      iconBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      progressBg: "bg-emerald-500",
      glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    },
    amber: {
      border: "border-amber-500/20 hover:border-amber-500/40",
      bg: "from-amber-600/10 via-slate-900 to-slate-950",
      iconBg: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      progressBg: "bg-amber-500",
      glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    },
    cyan: {
      border: "border-cyan-500/20 hover:border-cyan-500/40",
      bg: "from-cyan-600/10 via-slate-900 to-slate-950",
      iconBg: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      progressBg: "bg-cyan-500",
      glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    },
    rose: {
      border: "border-rose-500/20 hover:border-rose-500/40",
      bg: "from-rose-600/10 via-slate-900 to-slate-950",
      iconBg: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
      progressBg: "bg-rose-500",
      glow: "group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]",
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      className={`group relative p-5 rounded-2xl bg-gradient-to-b ${scheme.bg} border ${scheme.border} transition-all duration-300 ${scheme.glow} backdrop-blur-xl`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4 mb-2">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${scheme.progressBg} transition-all duration-500 rounded-full`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {(change || subtitle) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded ${
                isPositive
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-rose-400 bg-rose-500/10"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
