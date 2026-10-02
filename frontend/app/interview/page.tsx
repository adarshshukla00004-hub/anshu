"use client";

import { useState } from "react";
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  Clock, 
  Volume2,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import AudioVisualizer from "@/components/AudioVisualizer";

interface Message {
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

export default function InterviewRoomPage() {
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [activeMode, setActiveMode] = useState<"voice" | "text">("voice");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userTextInput, setUserTextInput] = useState("");

  const interviewQuestions = [
    {
      id: "q1",
      category: "System Architecture",
      difficulty: "Senior / High Yield",
      targetTime: "3-4 mins",
      question:
        "How would you design a distributed cache layer using Redis for a high-traffic e-commerce checkout service? Specifically explain how you avoid cache stampede and ensure consistency.",
      rubricTips: "Mention Cache-Aside vs Write-Through, Mutex/Locks for Stampede, TTL jitter, and invalidation strategies.",
    },
    {
      id: "q2",
      category: "Frontend Deep Dive",
      difficulty: "Mid-Senior",
      targetTime: "2-3 mins",
      question:
        "Explain how React 18 Concurrent Rendering and Server Components change data fetching compared to traditional client-side useEffect cascades.",
      rubricTips: "Mention Suspense boundaries, streaming SSR, zero bundle impact of Server Components, and elimination of network waterfalls.",
    },
    {
      id: "q3",
      category: "Behavioral (STAR Method)",
      difficulty: "Cultural Fit",
      targetTime: "3 mins",
      question:
        "Describe a time when you discovered a critical bug in production right before a project deadline. How did you triage, communicate, and resolve it?",
      rubricTips: "Look for Situation, Task, Action (isolation, rollback/hotfix, stakeholder update), and Result (post-mortem, test automation).",
    },
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to your AI Mock Interview session, Anshu. Today we're evaluating your technical depth for the Full Stack SDE role. Let's begin with our first scenario: " +
        interviewQuestions[0].question,
      timestamp: "Just now",
    },
  ]);

  const currentQ = interviewQuestions[currentQuestionIndex];

  const handleToggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      setIsAiSpeaking(false);
    } else {
      setIsListening(false);
      // Simulate user speech submission & AI processing
      simulateUserAnswer(
        "To prevent cache stampede, I would implement a mutex lock on key miss so only one worker queries PostgreSQL, while others await the cache population. I'd also add jitter to TTLs to avoid simultaneous expiration."
      );
    }
  };

  const simulateUserAnswer = (answerText: string) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: answerText,
        timestamp: "Just now",
      },
    ]);

    setIsAiSpeaking(true);
    setTimeout(() => {
      setIsAiSpeaking(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Excellent explanation of mutex locks and TTL jitter to solve cache stampede. For extra points: how would you handle cache consistency if a price update transaction rolls back in the database?",
          timestamp: "Just now",
        },
      ]);
    }, 2500);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userTextInput.trim()) return;
    simulateUserAnswer(userTextInput);
    setUserTextInput("");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase tracking-wider">
              AI Mock Interview Room
            </span>
            <span className="text-xs text-slate-400">• Session #05</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Voice & Text Simulated Interview
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Practice real-time technical and behavioral scenarios with instant rubric evaluation and speech cadence metrics.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveMode("voice")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeMode === "voice"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Mode</span>
          </button>
          <button
            onClick={() => setActiveMode("text")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeMode === "text"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Text / Code Mode</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: AI Stage & Visualizer & Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Question Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  Question {currentQuestionIndex + 1} of {interviewQuestions.length}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {currentQ.category}
                </span>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Target: {currentQ.targetTime}
              </span>
            </div>

            <h3 className="text-base md:text-lg font-bold text-white mb-2 leading-snug">
              {currentQ.question}
            </h3>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 italic">
                Tip: {currentQ.rubricTips}
              </span>
              <button
                onClick={() => setIsAiSpeaking(true)}
                className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium ml-2 flex-shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Repeat Question</span>
              </button>
            </div>
          </div>

          {/* Audio Visualizer Component */}
          <AudioVisualizer isListening={isListening} isAiSpeaking={isAiSpeaking} />

          {/* Voice Interaction Toolbar */}
          {activeMode === "voice" ? (
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Telemetry info */}
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Cadence: <strong>135 WPM (Optimal)</strong></span>
                </div>
                <div className="text-slate-600">•</div>
                <div>Fillers: <strong>1 detected</strong></div>
              </div>

              {/* Main Action Mic Trigger */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleMic}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl ${
                    isListening
                      ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-600/30"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25"
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5" />
                      <span>Stop & Analyze Answer</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>Push to Speak Answer</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() =>
                    setCurrentQuestionIndex(
                      (prev) => (prev + 1) % interviewQuestions.length
                    )
                  }
                  className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                  aria-label="Next interview question"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            /* Text mode input */
            <form onSubmit={handleSendText} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
              <input
                type="text"
                value={userTextInput}
                onChange={(e) => setUserTextInput(e.target.value)}
                placeholder="Type your structured answer here (e.g. STAR methodology or technical architecture)..."
                className="flex-1 bg-slate-950 text-sm text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit</span>
              </button>
            </form>
          )}

          {/* Transcript Log */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              Live Interview Transcript
            </h4>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl text-xs leading-relaxed flex items-start gap-3 ${
                    msg.role === "assistant"
                      ? "bg-slate-950/80 border border-slate-800/80 text-slate-300"
                      : "bg-indigo-950/40 border border-indigo-500/20 text-indigo-100"
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 flex-shrink-0 mt-0.5">
                    {msg.role === "assistant" ? (
                      <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">
                        {msg.role === "assistant" ? "AI Lead Interviewer" : "You (Candidate)"}
                      </span>
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                    </div>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Instant AI Rubric Feedback */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Live AI Rubric Scoring
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Passing Tier (86%)
              </span>
            </div>

            {/* Overall Score Badge */}
            <div className="flex items-center justify-center p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-6">
              <div className="text-center">
                <span className="text-4xl font-black text-white">86</span>
                <span className="text-slate-400 text-sm font-semibold"> / 100</span>
                <span className="block text-xs text-indigo-400 font-semibold mt-1">
                  Strong Hire Recommendation
                </span>
              </div>
            </div>

            {/* Rubric Breakdown Progress Bars */}
            <div className="space-y-4 mb-6">
              {[
                { label: "Technical Accuracy & Depth", score: 88, color: "bg-indigo-500" },
                { label: "Communication & Clarity (STAR)", score: 85, color: "bg-emerald-500" },
                { label: "Trade-offs & Edge Cases", score: 80, color: "bg-cyan-500" },
                { label: "Confidence & Voice Cadence", score: 92, color: "bg-purple-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className="text-slate-400 font-mono font-bold">{item.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Rubric AI Feedback Notes */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Instant AI Evaluator Feedback:
              </h4>

              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> What worked well:
                </span>
                <p>
                  Directly addressed the cache stampede problem using concurrency locks and demonstrated knowledge of cache-aside patterns.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Next Level Polish:
                </span>
                <p>
                  Specify approximate numbers (e.g. &ldquo;At 10,000 QPS, Redis cluster sharding would distribute keys across slots...&rdquo;).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
