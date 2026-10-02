"use client";

import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw,
  FileCheck,
  AlertTriangle
} from "lucide-react";

interface ResumeDropzoneProps {
  onParsed?: (resumeData: {
    fileName: string;
    score: number;
    skills: string[];
    missing: string[];
    strengths: string[];
    improvements: string[];
  }) => void;
}

export default function ResumeDropzone({ onParsed }: ResumeDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateParse = (fileName: string, type: "sde" | "data" = "sde") => {
    setIsParsing(true);
    setParseProgress(10);

    const stepInterval = setInterval(() => {
      setParseProgress((prev) => {
        if (prev >= 90) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsParsing(false);
            setParseProgress(100);

            if (onParsed) {
              if (type === "sde") {
                onParsed({
                  fileName,
                  score: 84,
                  skills: [
                    "React.js",
                    "Next.js",
                    "TypeScript",
                    "Node.js",
                    "PostgreSQL",
                    "TailwindCSS",
                    "Git & GitHub",
                    "REST APIs",
                  ],
                  missing: [
                    "System Design (Caching/Redis)",
                    "Docker & Kubernetes",
                    "Unit Testing (Jest/Playwright)",
                    "AWS S3 / Cloud Deployment",
                  ],
                  strengths: [
                    "Strong component architecture & frontend performance practices",
                    "Clean database relational modeling with PostgreSQL",
                    "Measurable impact metrics in prior project bullets (e.g. 40% speedup)",
                  ],
                  improvements: [
                    "Add production telemetry or monitoring (e.g. Sentry/Datadog)",
                    "Quantify unit and integration test coverage",
                    "Include microservices or message broker experience (Kafka/RabbitMQ)",
                  ],
                });
              } else {
                onParsed({
                  fileName,
                  score: 79,
                  skills: [
                    "Python",
                    "Pandas & NumPy",
                    "SQL / BigQuery",
                    "Data Visualization (Tableau)",
                    "Machine Learning Basics",
                    "Statistics & A/B Testing",
                  ],
                  missing: [
                    "Feature Store (Feast/Hopsworks)",
                    "MLOps / MLflow Pipelines",
                    "Apache Spark / PySpark",
                    "Vector DBs & Embeddings",
                  ],
                  strengths: [
                    "Solid data wrangling and ETL scripting skills",
                    "Good understanding of hypothesis testing and statistical power",
                  ],
                  improvements: [
                    "Demonstrate cloud data warehousing scale (>1M rows)",
                    "Include automated model retraining or pipeline orchestration",
                  ],
                });
              }
            }
          }, 400);
          return 95;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      simulateParse(droppedFile.name, "sde");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      simulateParse(selected.name, "sde");
    }
  };

  const loadDemo = (type: "sde" | "data") => {
    const demoName =
      type === "sde" ? "Anshu_Jha_SDE_Resume.pdf" : "Anshu_Jha_DataAnalyst_Resume.pdf";
    setFile(new File(["demo content"], demoName, { type: "application/pdf" }));
    simulateParse(demoName, type);
  };

  return (
    <div className="space-y-4">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-indigo-400 bg-indigo-500/10 scale-[1.01]"
            : "border-slate-700 hover:border-indigo-500/50 bg-slate-900/60 hover:bg-slate-900/90"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
          {file ? <FileCheck className="w-7 h-7 text-emerald-400" /> : <UploadCloud className="w-7 h-7" />}
        </div>

        <h4 className="text-base font-bold text-white mb-1">
          {file ? file.name : "Drag & Drop your resume or Browse file"}
        </h4>
        <p className="text-xs text-slate-400 mb-4 text-center max-w-sm">
          Supports PDF, DOCX, TXT. Our ATS engine analyzes keyword density, recruiter heuristics & skill match.
        </p>

        {isParsing ? (
          <div className="w-full max-w-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Deep ATS Parsing...
              </span>
              <span>{parseProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
                style={{ width: `${parseProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Select Local Resume</span>
          </div>
        )}
      </div>

      {/* Quick Demo Resumes */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Don&apos;t have your resume ready right now?</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadDemo("sde")}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
          >
            Load SDE Sample Resume
          </button>
          <button
            type="button"
            onClick={() => loadDemo("data")}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
          >
            Load Data Analyst Sample
          </button>
        </div>
      </div>
    </div>
  );
}
