"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Copy, 
  Check, 
  Target,
  Download
} from "lucide-react";
import ResumeDropzone from "@/components/ResumeDropzone";

interface ResumeParsedData {
  fileName: string;
  score: number;
  skills: string[];
  missing: string[];
  strengths: string[];
  improvements: string[];
}

export default function ResumeAnalyzerPage() {
  const [parsedData, setParsedData] = useState<ResumeParsedData>({
    fileName: "Anshu_Jha_SDE_Resume.pdf",
    score: 84,
    skills: [
      "React.js",
      "Next.js 14",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "TailwindCSS",
      "Git & GitHub",
      "RESTful APIs",
    ],
    missing: [
      "System Design (Caching/Redis)",
      "Docker & Containerization",
      "Unit Testing (Jest/Playwright)",
      "AWS S3 / Cloud Deployment",
    ],
    strengths: [
      "High component modularity and modern React hook utilization",
      "Quantified bullet points with measurable latency reductions",
      "Clean single-column ATS readable formatting",
    ],
    improvements: [
      "Infuse keywords around cloud infrastructure and containerization",
      "Highlight end-to-end integration and automated CI/CD pipelines",
      "Add explicit distributed systems concepts (Rate limiting, Redis cache)",
    ],
  });

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const bulletOptimizations = [
    {
      role: "Project Bullet: E-Commerce Platform",
      before: "Created full stack shopping website using React and Node.js with database integration.",
      after:
        "Architected scalable full stack e-commerce platform using Next.js 14, TypeScript, and PostgreSQL; reduced database response latency by 38% via indexing and optimized connection pooling.",
      impact: "+18 ATS Keyword Match",
    },
    {
      role: "Work Experience: Frontend Developer Intern",
      before: "Worked on UI components and fixed bugs reported by users in production.",
      after:
        "Spearheaded redesign of 14 core UI components using Tailwind CSS and Radix primitives, achieving 99.4% cross-browser fidelity and reducing cumulative layout shift (CLS) from 0.18 to 0.02.",
      impact: "+14 Recruiter Relevance",
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold uppercase tracking-wider">
              ATS Diagnostics v2.4
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Resume Upload & Skill Gap View
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Parse resume against recruiter ATS algorithms, pinpoint missing technical competencies, and generate high-impact bullet points.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/roadmap"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sync Roadmap Gaps</span>
          </Link>
        </div>
      </div>

      {/* Upload Dropzone */}
      <ResumeDropzone
        onParsed={(data) => {
          setParsedData(data);
        }}
      />

      {/* Analysis Results View */}
      {parsedData && (
        <div className="space-y-8">
          {/* Top Score Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* ATS Score Radial / Box */}
              <div className="md:col-span-4 flex items-center gap-5 border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
                <div className="relative flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-slate-950 border-4 border-indigo-500/30 flex flex-col items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      {parsedData.score}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                      / 100
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">High ATS Compatibility</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Matches 84% of required keywords for <strong className="text-slate-200">Full Stack Engineer</strong> listings.
                  </p>
                  <div className="mt-2 text-[11px] text-emerald-400 font-semibold">
                    ✓ Clears top 15% recruiter screening filters
                  </div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Parsed File</span>
                  <span className="text-xs font-semibold text-white truncate block">
                    {parsedData.fileName}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Matched Keywords</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {parsedData.skills.length} Detected
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Missing Gaps</span>
                  <span className="text-xs font-semibold text-rose-400">
                    {parsedData.missing.length} Gaps Found
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Readiness Boost</span>
                  <span className="text-xs font-semibold text-indigo-400">+12% with fixes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detected Skills */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Validated Technical Skills
                </h3>
                <span className="text-xs text-emerald-400 font-semibold">
                  {parsedData.skills.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                These skills were recognized by the parser with matching context and evidence in your projects.
              </p>

              <div className="flex flex-wrap gap-2">
                {parsedData.skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-xs font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Candidate Strengths:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {parsedData.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Critical Skill Gaps */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                  Missing Critical Competencies
                </h3>
                <span className="text-xs text-rose-400 font-semibold">
                  {parsedData.missing.length} Missing
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                These skills frequently appear in target job descriptions but are currently absent from your resume.
              </p>

              <div className="flex flex-wrap gap-2">
                {parsedData.missing.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/25 text-xs font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Recommended Action Plan:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {parsedData.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* AI Bullet Point Optimizer */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  AI Resume Bullet Point Enhancer
                </h3>
                <p className="text-xs text-slate-400">
                  Transform passive descriptions into metrics-driven, ATS-tailored impact statements.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Google XYZ / Harvard Standard
              </span>
            </div>

            <div className="space-y-4">
              {bulletOptimizations.map((opt, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">{opt.role}</span>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {opt.impact}
                    </span>
                  </div>

                  {/* Before & After comparison */}
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs">
                      <span className="font-semibold text-rose-400 block mb-0.5">Original (Weak):</span>
                      <p className="text-slate-300 italic">&ldquo;{opt.before}&rdquo;</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs relative group">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-emerald-400">AI Enhanced (ATS Optimized):</span>
                        <button
                          onClick={() => handleCopy(opt.after, i)}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 transition-colors"
                        >
                          {copiedIndex === i ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-white font-medium">&ldquo;{opt.after}&rdquo;</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
