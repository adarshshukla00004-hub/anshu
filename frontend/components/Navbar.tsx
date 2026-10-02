"use client";

import { useState } from "react";
import { 
  Bell, 
  Search, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown,
  Calendar,
  Zap
} from "lucide-react";

export default function Navbar() {
  const [selectedRole, setSelectedRole] = useState("Full Stack Engineer");
  const [showRoleSelect, setShowRoleSelect] = useState(false);

  const roles = [
    "Full Stack Engineer",
    "Frontend Specialist (React/Next)",
    "AI/ML Engineer Intern",
    "Cloud & DevOps Associate",
    "Data Analyst / BI Intern"
  ];

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search & Role focus */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-xs">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills, roadmaps, questions..."
            className="w-full bg-slate-900/90 text-sm text-slate-200 pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Target role selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSelect(!showRoleSelect)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-colors"
          >
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Targeting:</span>
            <span className="text-white font-semibold">{selectedRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleSelect && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase">
                Switch Benchmark Track
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setSelectedRole(r);
                    setShowRoleSelect(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                    selectedRole === r
                      ? "bg-indigo-600/20 text-indigo-300 font-semibold"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <span>{r}</span>
                  {selectedRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side stats & action triggers */}
      <div className="flex items-center gap-3">
        {/* Streak counter */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
          <span>7-Day Prep Streak</span>
        </div>

        {/* Next mock interview session */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>Mock Interview: <strong className="text-white font-semibold">Tomorrow, 4 PM</strong></span>
        </div>

        {/* Notifications */}
        <button 
          aria-label="View notifications"
          className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
        </button>

        {/* Live sync CTA */}
        <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Recalculate</span>
        </button>
      </div>
    </header>
  );
}
