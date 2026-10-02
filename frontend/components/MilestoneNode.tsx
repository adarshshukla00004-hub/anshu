"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Lock,
  Sparkles
} from "lucide-react";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  resourceTitle?: string;
  resourceLink?: string;
}

export interface Milestone {
  id: string;
  stepNumber: number;
  phase: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "locked";
  estimatedHours: number;
  skillsGained: string[];
  tasks: SubTask[];
}

interface MilestoneNodeProps {
  milestone: Milestone;
  onToggleTask: (milestoneId: string, taskId: string) => void;
}

export default function MilestoneNode({ milestone, onToggleTask }: MilestoneNodeProps) {
  const [expanded, setExpanded] = useState(milestone.status === "in-progress");

  const completedCount = milestone.tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / milestone.tasks.length) * 100);

  const statusStyles = {
    completed: {
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      border: "border-emerald-500/30",
      nodeBg: "bg-emerald-500 text-slate-950 font-bold",
      nodeRing: "ring-4 ring-emerald-500/20",
    },
    "in-progress": {
      badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      border: "border-indigo-500/40 shadow-lg shadow-indigo-500/10",
      nodeBg: "bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white font-bold",
      nodeRing: "ring-4 ring-indigo-500/30 animate-pulse",
    },
    locked: {
      badge: "bg-slate-800 text-slate-400 border-slate-700",
      border: "border-slate-800 opacity-70",
      nodeBg: "bg-slate-800 text-slate-500",
      nodeRing: "",
    },
  };

  const currentStyle = statusStyles[milestone.status];

  return (
    <div className={`rounded-2xl bg-slate-900/80 border ${currentStyle.border} backdrop-blur-xl transition-all duration-300 overflow-hidden`}>
      {/* Node Header */}
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Step Number Badge */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${currentStyle.nodeBg} ${currentStyle.nodeRing}`}
          >
            {milestone.status === "completed" ? (
              <CheckCircle2 className="w-5 h-5 text-slate-950" />
            ) : milestone.status === "locked" ? (
              <Lock className="w-4 h-4 text-slate-400" />
            ) : (
              <span>0{milestone.stepNumber}</span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {milestone.phase}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${currentStyle.badge}`}>
                {milestone.status === "in-progress" ? "In Progress" : milestone.status.toUpperCase()}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                {milestone.estimatedHours} hrs est.
              </span>
            </div>

            <h4 className="text-base font-bold text-white mb-1">{milestone.title}</h4>
            <p className="text-xs text-slate-400 max-w-xl">{milestone.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {milestone.skillsGained.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                >
                  +{skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress & Toggle */}
        <div className="flex flex-col items-end gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-white">{completedCount}/{milestone.tasks.length}</span>
            <span className="text-[11px] text-slate-400 block">{progressPercent}% done</span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            aria-label="Toggle milestone tasks"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full h-1 bg-slate-800">
        <div
          className={`h-full transition-all duration-500 ${
            milestone.status === "completed"
              ? "bg-emerald-500"
              : "bg-gradient-to-r from-indigo-500 to-cyan-400"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Expandable Task List */}
      {expanded && (
        <div className="p-5 bg-slate-950/60 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span>Milestone Checkpoints</span>
            <span className="text-[11px] text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Auto-updates Readiness Score
            </span>
          </div>

          {milestone.tasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                task.completed
                  ? "bg-slate-900/40 border-slate-800/60 text-slate-400"
                  : "bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700"
              }`}
            >
              <button
                onClick={() => onToggleTask(milestone.id, task.id)}
                className="flex items-center gap-3 text-left flex-1 group"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 flex-shrink-0" />
                )}
                <span
                  className={`text-xs font-medium transition-all ${
                    task.completed ? "line-through text-slate-400" : "text-slate-200"
                  }`}
                >
                  {task.title}
                </span>
              </button>

              {task.resourceTitle && (
                <a
                  href={task.resourceLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors flex-shrink-0"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{task.resourceTitle}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
