"use client";

import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Award, 
  Briefcase, 
  FileText, 
  Mic, 
  Compass, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Zap,
  Target,
  BarChart3
} from "lucide-react";
import StatCard from "@/components/StatCard";
import SkillRadar from "@/components/SkillRadar";

export default function DiagnosticDashboard() {
  const dailyTasks = [
    {
      id: "1",
      title: "Add Redis caching architecture to Next.js Capstone project",
      impact: "High Impact (+4% Readiness)",
      category: "Roadmap Milestone 3",
      completed: false,
    },
    {
      id: "2",
      title: "Complete 15-min AI Voice Mock: System Design (Rate Limiter)",
      impact: "Interview Prep (+3% Confidence)",
      category: "AI Mock Room",
      completed: true,
    },
    {
      id: "3",
      title: "Review missing keywords in ATS Resume for FinTech roles",
      impact: "Resume Gap (-2 Critical Tags)",
      category: "Analyzer",
      completed: false,
    },
    {
      id: "4",
      title: "1-Click Apply to 3 newly matched SDE Summer Internships",
      impact: "Job Pipeline (92% Match)",
      category: "Internship Matcher",
      completed: false,
    },
  ];

  const recentEvents = [
    {
      time: "2 hours ago",
      title: "Behavioral AI Mock Graded",
      desc: "Scored 86/100 on STAR methodology & leadership traits.",
      icon: Mic,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      time: "Yesterday",
      title: "ATS Resume Analysis Synced",
      desc: "Uploaded Anshu_Jha_SDE_Resume.pdf (ATS Score: 84/100).",
      icon: FileText,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      time: "2 days ago",
      title: "Milestone Completed",
      desc: "Phase 2: Relational Schema & Next.js API Routes finished.",
      icon: Compass,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              <span>Real-Time Diagnostic Snapshot</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="gradient-text">Anshu</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your placement probability is trending upward. Closing the <strong className="text-white font-semibold">System Design & Docker</strong> gap will elevate you into the top 10% candidate percentile for SDE 2026 roles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/analyzer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs md:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Analyze Resume</span>
            </Link>
            <Link
              href="/interview"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs md:text-sm font-semibold transition-all"
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Launch AI Mock</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard
          title="Placement Readiness Index"
          value="78 / 100"
          change="+14% this month"
          isPositive={true}
          subtitle="Top 15% cohort"
          icon={Award}
          color="indigo"
          progress={78}
        />
        <StatCard
          title="ATS Resume Benchmark"
          value="84%"
          change="+8 pts"
          isPositive={true}
          subtitle="Strong keyword match"
          icon={FileText}
          color="cyan"
          progress={84}
        />
        <StatCard
          title="AI Mock Interview Index"
          value="82 / 100"
          change="4 Sessions"
          isPositive={true}
          subtitle="High clarity & depth"
          icon={Mic}
          color="emerald"
          progress={82}
        />
        <StatCard
          title="Curated Internship Matches"
          value="12 Roles"
          change="3 Near You"
          isPositive={true}
          subtitle="Avg Stipend: ₹45k/mo"
          icon={Briefcase}
          color="amber"
          progress={65}
        />
      </div>

      {/* Center Grid: Radar & Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Skill Competency Radar & Daily Priority Checklist */}
        <div className="lg:col-span-8 space-y-8">
          <SkillRadar />

          {/* Daily Action Checklist */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Recommended Next Actions
                </h3>
                <p className="text-xs text-slate-400">High-yield tasks prioritized by AI placement engine</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">1 of 4 Completed</span>
            </div>

            <div className="space-y-3">
              {dailyTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    task.completed
                      ? "bg-slate-950/40 border-slate-800/60 opacity-60"
                      : "bg-slate-950/80 border-slate-800/90 hover:border-indigo-500/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 hover:border-indigo-400 cursor-pointer" />
                      )}
                    </div>
                    <div>
                      <h4
                        className={`text-xs md:text-sm font-semibold ${
                          task.completed ? "line-through text-slate-400" : "text-white"
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {task.category}
                        </span>
                        <span className="text-[11px] text-indigo-400 font-medium">{task.impact}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Readiness Breakdown & Quick Launchers */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Module Launchers */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl">
            <h3 className="text-base font-bold text-white mb-4">Quick Workspaces</h3>

            <div className="space-y-2.5">
              <Link
                href="/analyzer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Resume & ATS Analyzer</div>
                    <div className="text-[11px] text-slate-400">Match against job descriptions</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/roadmap"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Milestone Canvas</div>
                    <div className="text-[11px] text-slate-400">5 Phases • 18 Project milestones</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/interview"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">AI Voice/Text Mock Room</div>
                    <div className="text-[11px] text-slate-400">Real-time rubric grading</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/jobs"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Internship Matcher</div>
                    <div className="text-[11px] text-slate-400">12 AI-curated opportunities</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          {/* Sub-domain Mastery Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Domain Readiness Breakdown
            </h3>

            <div className="space-y-3.5">
              {[
                { domain: "Frontend (React/Next)", pct: 85, color: "bg-indigo-500" },
                { domain: "Backend (Node/SQL)", pct: 75, color: "bg-cyan-500" },
                { domain: "System Architecture", pct: 45, color: "bg-amber-500" },
                { domain: "Cloud / Containerization", pct: 40, color: "bg-rose-500" },
                { domain: "Behavioral & STAR", pct: 82, color: "bg-emerald-500" },
              ].map((item) => (
                <div key={item.domain}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{item.domain}</span>
                    <span className="text-slate-400 font-mono">{item.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-700`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Recent Diagnostic Activity
            </h3>

            <div className="space-y-4">
              {recentEvents.map((evt, i) => {
                const Icon = evt.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl border flex-shrink-0 ${evt.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white truncate">{evt.title}</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{evt.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{evt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
