"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Compass, 
  Mic, 
  Briefcase, 
  Sparkles, 
  ChevronRight, 
  Flame,
  Award
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  tagColor?: string;
}

const navItems: NavItem[] = [
  { 
    name: "Diagnostic Dashboard", 
    href: "/", 
    icon: LayoutDashboard,
  },
  { 
    name: "Resume & Skill Gap", 
    href: "/analyzer", 
    icon: FileText,
    badge: "ATS AI"
  },
  { 
    name: "Milestone Roadmap", 
    href: "/roadmap", 
    icon: Compass,
    badge: "Live"
  },
  { 
    name: "AI Mock Interview", 
    href: "/interview", 
    icon: Mic,
    badge: "Voice",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  { 
    name: "Internship Matcher", 
    href: "/jobs", 
    icon: Briefcase,
    badge: "12 New"
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl flex flex-col flex-shrink-0 min-h-screen z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">CareerForge</span>
              <span className="text-[10px] px-1.5 py-0.5 font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400">AI Placement Engine</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core Workspaces
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600/20 to-indigo-600/5 text-white border border-indigo-500/30 shadow-sm shadow-indigo-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-500 rounded-r-full shadow-lg shadow-indigo-500/50" />
              )}
              
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                    item.tagColor || "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Readiness Widget in Sidebar */}
      <div className="p-4 mx-3 mb-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Placement Index</span>
          </div>
          <span className="text-xs font-bold text-emerald-400">78%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full w-[78%] transition-all duration-700" />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Target: SDE Intern</span>
          <span className="text-indigo-300 font-medium">+14% this week</span>
        </div>
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
              AJ
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-white truncate">Anshu Jha</div>
            <div className="text-[11px] text-slate-400 truncate">Computer Science &apos;26</div>
          </div>
        </div>
        <Award className="w-4 h-4 text-slate-500" />
      </div>
    </aside>
  );
}
