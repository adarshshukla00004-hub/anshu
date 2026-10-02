"use client";

import { useState } from "react";
import { 
  Briefcase, 
  MapPin, 
  Search, 
  Filter, 
  Sparkles, 
  SlidersHorizontal, 
  CheckCircle2, 
  Building2,
  Calendar,
  Send,
  Zap
} from "lucide-react";
import JobCard, { JobListing } from "@/components/JobCard";

const initialJobs: JobListing[] = [
  {
    id: "job-1",
    title: "Full Stack Engineer Intern (Summer 2026)",
    company: "Razorpay",
    logoText: "RZ",
    location: "Bengaluru",
    workMode: "Hybrid",
    stipend: "₹65,000 / month",
    duration: "6 Months",
    matchScore: 94,
    matchedSkills: ["Next.js", "TypeScript", "PostgreSQL", "Node.js", "REST APIs"],
    missingSkills: ["Redis Caching", "Docker"],
    postedTime: "1 day ago",
    applicants: 42,
    description:
      "Join our Checkout Engineering team. You will build high-reliability dashboard widgets, optimize transaction latency, and implement responsive UI flows across 15M+ daily checkout experiences.",
  },
  {
    id: "job-2",
    title: "Software Engineering Intern - Frontend Systems",
    company: "Swiggy",
    logoText: "SW",
    location: "Bengaluru / Remote",
    workMode: "Hybrid",
    stipend: "₹50,000 / month",
    duration: "3-6 Months",
    matchScore: 91,
    matchedSkills: ["React.js", "TypeScript", "TailwindCSS", "Next.js"],
    missingSkills: ["Jest / Testing"],
    postedTime: "2 days ago",
    applicants: 89,
    description:
      "Scale our customer-facing web apps with Next.js 14 and edge rendering. Focus on sub-second load times, micro-frontends, and accessible interactive cart and order tracking components.",
  },
  {
    id: "job-3",
    title: "Junior Cloud & Full Stack Developer",
    company: "Postman",
    logoText: "PM",
    location: "Bengaluru",
    workMode: "Hybrid",
    stipend: "₹60,000 / month",
    duration: "6 Months",
    matchScore: 86,
    matchedSkills: ["Node.js", "REST APIs", "TypeScript", "Git & GitHub"],
    missingSkills: ["Docker & Kubernetes", "AWS S3"],
    postedTime: "3 days ago",
    applicants: 64,
    description:
      "Work closely with our API Platform engineering team. Build developer tooling, manage OpenAPI schema synchronizations, and contribute to public developer documentation and client libraries.",
  },
  {
    id: "job-4",
    title: "AI & Full Stack Product Intern",
    company: "Groww",
    logoText: "GW",
    location: "Remote / Bengaluru",
    workMode: "Remote",
    stipend: "₹45,000 / month",
    duration: "4 Months",
    matchScore: 82,
    matchedSkills: ["React.js", "Node.js", "PostgreSQL", "TailwindCSS"],
    missingSkills: ["System Design", "Vector DBs"],
    postedTime: "4 days ago",
    applicants: 110,
    description:
      "Help build next-gen investor portfolio dashboards with interactive charts and automated financial insights powered by LLM summaries.",
  },
  {
    id: "job-5",
    title: "Frontend Engineering Intern",
    company: "Zepto",
    logoText: "ZP",
    location: "Mumbai",
    workMode: "On-site",
    stipend: "₹40,000 / month",
    duration: "3 Months",
    matchScore: 78,
    matchedSkills: ["React.js", "JavaScript", "TailwindCSS", "REST APIs"],
    missingSkills: ["Next.js 14", "TypeScript Strict"],
    postedTime: "5 days ago",
    applicants: 76,
    description:
      "Develop rapid delivery tracking interfaces and warehouse operator portals with high responsiveness and low-latency websocket updates.",
  },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobListing[]>(initialJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [minMatch, setMinMatch] = useState(70);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const cities = ["All", "Bengaluru", "Mumbai", "Delhi NCR", "Remote"];
  const modes = ["All", "Remote", "Hybrid", "On-site"];

  const handleApply = (job: JobListing) => {
    setAppliedJobs((prev) => [...prev, job.id]);
    setNotification(
      `Successfully generated tailored ATS resume and sent 1-Click Application to ${job.company}!`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.matchedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity =
      selectedCity === "All" ||
      job.location.toLowerCase().includes(selectedCity.toLowerCase());

    const matchesMode =
      selectedMode === "All" || job.workMode.toLowerCase() === selectedMode.toLowerCase();

    const matchesScore = job.matchScore >= minMatch;

    return matchesSearch && matchesCity && matchesMode && matchesScore;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-indigo-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-3 border border-indigo-400/30 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold uppercase tracking-wider">
              Localized Internship Matcher
            </span>
            <span className="text-xs text-slate-400">• High Hiring Velocity</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            AI Matched Tech Internships
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Filtered specifically against your ATS resume keywords and current milestone competency ratings.
          </p>
        </div>

        {/* Applied Counter */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">
            Pipeline: <strong>{appliedJobs.length} Applications Sent</strong>
          </span>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, role, or skill (e.g. Next.js, Razorpay)..."
              className="w-full bg-slate-950 text-xs md:text-sm text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* City / Location Filter */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-400 ml-2" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                aria-label="Filter internships by city"
                className="bg-transparent text-slate-200 w-full py-1.5 pr-2 focus:outline-none cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c === "All" ? "All Locations" : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Work Mode Filter */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 ml-2" />
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                aria-label="Filter internships by work mode"
                className="bg-transparent text-slate-200 w-full py-1.5 pr-2 focus:outline-none cursor-pointer"
              >
                {modes.map((m) => (
                  <option key={m} value={m} className="bg-slate-900 text-white">
                    {m === "All" ? "All Work Modes" : m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Match Percentage Slider & Match Quick Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">
              Minimum ATS Match: <strong className="text-white font-bold">{minMatch}%</strong>
            </span>
            <input
              type="range"
              min="60"
              max="95"
              step="5"
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              aria-label="Filter by minimum ATS match percentage"
              className="accent-indigo-500 cursor-pointer w-32"
            />
          </div>

          <div className="text-slate-400">
            Showing <strong className="text-white">{filteredJobs.length}</strong> matching roles
          </div>
        </div>
      </div>

      {/* Job Card Grid */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
          ))
        ) : (
          <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
            <p className="text-slate-400 text-sm">
              No internships match your current filter settings. Try adjusting the minimum match threshold or location.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
