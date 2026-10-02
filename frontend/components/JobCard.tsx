"use client";

import React, { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Banknote, 
  Clock, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  Send,
  AlertCircle
} from "lucide-react";

export interface JobListing {
  id: string;
  title: string;
  company: string;
  logoText: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  stipend: string;
  duration: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  postedTime: string;
  applicants: number;
  description: string;
}

interface JobCardProps {
  job: JobListing;
  onApply?: (job: JobListing) => void;
}

export default function JobCard({ job, onApply }: JobCardProps) {
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    if (onApply) onApply(job);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 75) return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
    return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group backdrop-blur-xl">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3.5">
          {/* Company Avatar Badge */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600/40 flex items-center justify-center text-white font-bold text-base flex-shrink-0 group-hover:border-indigo-500/40 transition-colors">
            {job.logoText}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {job.title}
              </h4>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {job.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location} ({job.workMode})
              </span>
            </div>
          </div>
        </div>

        {/* Match Percentage Badge & Bookmark */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getMatchColor(
              job.matchScore
            )}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{job.matchScore}% Match</span>
          </div>

          <button
            onClick={() => setSaved(!saved)}
            className={`p-1.5 rounded-lg border transition-colors ${
              saved
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white"
            }`}
            aria-label="Save job listing"
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-amber-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Role Details Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs mb-4">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Banknote className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono font-semibold text-white">{job.stipend}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{job.duration}</span>
        </div>
        <div className="col-span-2 sm:col-span-1 text-slate-400 text-right sm:text-left">
          <span>{job.applicants} applied</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
        {job.description}
      </p>

      {/* Skill Alignment Tags */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Matching Skills:
          </span>
          {job.matchedSkills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              {skill}
            </span>
          ))}
        </div>

        {job.missingSkills.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Skill Delta:
            </span>
            {job.missingSkills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Posted {job.postedTime}</span>

        <button
          onClick={handleApply}
          disabled={applied}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            applied
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
              : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-600/20"
          }`}
        >
          {applied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Applied with Tailored Resume</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>1-Click Apply</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
