"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Target, 
  Filter, 
  PlusCircle, 
  Zap,
  ArrowRight
} from "lucide-react";
import MilestoneNode, { Milestone } from "@/components/MilestoneNode";

const initialMilestones: Milestone[] = [
  {
    id: "m1",
    stepNumber: 1,
    phase: "Phase 1: Foundations",
    title: "Modern TypeScript & Advanced Asynchronous Architecture",
    description: "Master strict typing, generic utility types, async event loops, promises, and error boundary handling.",
    status: "completed",
    estimatedHours: 14,
    skillsGained: ["TypeScript Generics", "Async/Await", "Strict Type Guards"],
    tasks: [
      { id: "t1-1", title: "Complete Advanced TypeScript Generics kata", completed: true, resourceTitle: "TS Handbook", resourceLink: "https://www.typescriptlang.org/docs/" },
      { id: "t1-2", title: "Implement custom event-emitter with type safety", completed: true, resourceTitle: "GitHub Pattern", resourceLink: "https://github.com" },
      { id: "t1-3", title: "Set up strict tsconfig.json rules with ESLint", completed: true },
    ],
  },
  {
    id: "m2",
    stepNumber: 2,
    phase: "Phase 2: Core Stack",
    title: "Next.js 14 App Router & Relational Database Modeling",
    description: "Build robust full-stack applications leveraging Server Components, Server Actions, and PostgreSQL with Prisma ORM.",
    status: "completed",
    estimatedHours: 22,
    skillsGained: ["Next.js 14", "PostgreSQL", "Prisma ORM", "Server Actions"],
    tasks: [
      { id: "t2-1", title: "Model multi-tenant database schema in PostgreSQL", completed: true, resourceTitle: "Postgres Guide", resourceLink: "https://www.postgresql.org/docs/" },
      { id: "t2-2", title: "Implement zero-waterfall data fetching with React Suspense", completed: true },
      { id: "t2-3", title: "Build secure authentication flow with session management", completed: true },
    ],
  },
  {
    id: "m3",
    stepNumber: 3,
    phase: "Phase 3: High Scale & Architecture",
    title: "Distributed Caching (Redis), Rate Limiting & Docker",
    description: "Tackle resume skill gap: implement in-memory caching to reduce latency, rate-limiting algorithms, and containerize the stack.",
    status: "in-progress",
    estimatedHours: 18,
    skillsGained: ["Redis Caching", "Docker", "Rate Limiting", "System Design"],
    tasks: [
      { id: "t3-1", title: "Deploy Redis cluster locally and integrate cache-aside pattern", completed: true, resourceTitle: "Redis University", resourceLink: "https://university.redis.com" },
      { id: "t3-2", title: "Implement sliding-window rate limiter middleware", completed: false, resourceTitle: "System Design Primer", resourceLink: "https://github.com/donnemartin/system-design-primer" },
      { id: "t3-3", title: "Write multi-stage Dockerfile and docker-compose orchestration", completed: false, resourceTitle: "Docker Docs", resourceLink: "https://docs.docker.com" },
      { id: "t3-4", title: "Benchmark API endpoint throughput under 500 concurrent connections", completed: false },
    ],
  },
  {
    id: "m4",
    stepNumber: 4,
    phase: "Phase 4: Cloud & Reliability",
    title: "Automated CI/CD Pipelines & Cloud Storage Integration",
    description: "Set up GitHub Actions testing workflows, cloud bucket asset storage (AWS S3/GCS), and automated canary deployments.",
    status: "locked",
    estimatedHours: 16,
    skillsGained: ["GitHub Actions", "AWS S3", "Canary Deployment", "Jest/Playwright"],
    tasks: [
      { id: "t4-1", title: "Configure GitHub Actions runner with automated lint and unit testing", completed: false },
      { id: "t4-2", title: "Implement presigned S3 upload URLs with mime-type validation", completed: false },
      { id: "t4-3", title: "Set up automated Playwright E2E smoke tests", completed: false },
    ],
  },
  {
    id: "m5",
    stepNumber: 5,
    phase: "Phase 5: Placement Capstone",
    title: "Production SaaS Capstone & AI Mock Interview Mastery",
    description: "Tie all technologies together into a flagship production capstone project with live documentation and interview pitch drills.",
    status: "locked",
    estimatedHours: 24,
    skillsGained: ["Portfolio Capstone", "System Pitch", "Technical Communication"],
    tasks: [
      { id: "t5-1", title: "Publish open-source repository with comprehensive README & architecture diagrams", completed: false },
      { id: "t5-2", title: "Complete 5 Voice AI mock interview rounds with >85% STAR rubric score", completed: false },
      { id: "t5-3", title: "Submit 10 targeted internship applications via Internship Matcher", completed: false },
    ],
  },
];

export default function RoadmapPage() {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed" | "locked">("all");

  const handleToggleTask = (milestoneId: string, taskId: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== milestoneId) return m;
        const updatedTasks = m.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const allCompleted = updatedTasks.every((t) => t.completed);
        const anyCompleted = updatedTasks.some((t) => t.completed);

        let newStatus: Milestone["status"] = m.status;
        if (allCompleted) newStatus = "completed";
        else if (anyCompleted || m.status === "in-progress") newStatus = "in-progress";

        return {
          ...m,
          status: newStatus,
          tasks: updatedTasks,
        };
      })
    );
  };

  const totalTasks = milestones.flatMap((m) => m.tasks).length;
  const completedTasks = milestones.flatMap((m) => m.tasks).filter((t) => t.completed).length;
  const overallPercent = Math.round((completedTasks / totalTasks) * 100);

  const filteredMilestones = milestones.filter((m) => {
    if (filter === "all") return true;
    return m.status === filter;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold uppercase tracking-wider">
              Dynamic Milestone Canvas
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Full Stack SDE Mastery Roadmap
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Self-updating milestone journey tailored to your ATS skill gap diagnostic results.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/interview"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Practice Current Milestone in AI Mock</span>
          </Link>
        </div>
      </div>

      {/* Progress Canvas Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Current Focus: Phase 3 (Distributed Caching & Docker)</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                Active Sprint
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Completing this phase closes your largest resume ATS gap and increases interview callback rate by an estimated 28%.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-2xl font-black text-white">{overallPercent}%</span>
              <span className="text-xs text-slate-400 block font-medium">
                {completedTasks} of {totalTasks} Checkpoints
              </span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700 shadow-sm shadow-cyan-400/50"
            style={{ width: `${overallPercent}%` }}
          />
        </div>

        {/* Milestones Phase Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-xs">
          {milestones.map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  m.status === "completed"
                    ? "bg-emerald-400"
                    : m.status === "in-progress"
                    ? "bg-indigo-400 animate-pulse"
                    : "bg-slate-600"
                }`}
              />
              <span
                className={`truncate ${
                  m.status === "completed"
                    ? "text-emerald-300 font-medium"
                    : m.status === "in-progress"
                    ? "text-white font-bold"
                    : "text-slate-500"
                }`}
              >
                0{m.stepNumber} {m.phase.split(":")[1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          {(["all", "in-progress", "completed", "locked"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                filter === tab
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "all" ? "All Milestones" : tab.replace("-", " ")}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Estimated Completion: <strong>4.5 Weeks (8 hrs/wk)</strong></span>
        </div>
      </div>

      {/* Milestone Nodes List */}
      <div className="space-y-4">
        {filteredMilestones.map((milestone) => (
          <MilestoneNode
            key={milestone.id}
            milestone={milestone}
            onToggleTask={handleToggleTask}
          />
        ))}
      </div>
    </div>
  );
}
