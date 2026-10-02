"use client";

import React, { useEffect, useState } from "react";
import { Mic, MicOff, Volume2, Sparkles } from "lucide-react";

interface AudioVisualizerProps {
  isListening: boolean;
  isAiSpeaking: boolean;
  barCount?: number;
}

export default function AudioVisualizer({
  isListening,
  isAiSpeaking,
  barCount = 28,
}: AudioVisualizerProps) {
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    // Generate initial bars
    setHeights(Array.from({ length: barCount }, () => 15));

    if (!isListening && !isAiSpeaking) {
      setHeights(Array.from({ length: barCount }, () => 10));
      return;
    }

    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: barCount }, (_, i) => {
          // Sine wave oscillation + random jitter
          const base = isAiSpeaking
            ? 30 + Math.sin(Date.now() / 150 + i * 0.4) * 45
            : isListening
            ? 20 + Math.random() * 65
            : 10;
          return Math.max(8, Math.min(95, base));
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isListening, isAiSpeaking, barCount]);

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 backdrop-blur-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          isListening
            ? "bg-emerald-500/10"
            : isAiSpeaking
            ? "bg-indigo-500/10"
            : "opacity-0"
        }`}
      />

      {/* Visualizer Status Indicator */}
      <div className="flex items-center gap-3 mb-6 z-10">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
            isListening
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : isAiSpeaking
              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              : "bg-slate-800/60 text-slate-400 border-slate-700/60"
          }`}
        >
          {isListening ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>User Audio Input Active</span>
            </>
          ) : isAiSpeaking ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              <span>AI Interviewer Speaking</span>
            </>
          ) : (
            <>
              <MicOff className="w-3.5 h-3.5 text-slate-500" />
              <span>Microphone Standby</span>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Sound Wave Bars */}
      <div className="h-28 flex items-center justify-center gap-1.5 w-full max-w-lg z-10 px-4">
        {heights.map((h, i) => {
          let barGradient = "bg-slate-700";
          if (isListening) {
            barGradient = "bg-gradient-to-t from-emerald-600 to-cyan-400";
          } else if (isAiSpeaking) {
            barGradient = "bg-gradient-to-t from-indigo-600 via-purple-500 to-pink-400";
          }

          return (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-100 ease-out ${barGradient}`}
              style={{
                height: `${h}%`,
                opacity: 0.35 + (h / 100) * 0.65,
              }}
            />
          );
        })}
      </div>

      {/* Audio Wave Legend / Metrics */}
      <div className="flex items-center justify-between w-full max-w-sm mt-6 text-[11px] text-slate-400 z-10">
        <div className="flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Noise Suppression: ON</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-slate-300">
          <span>Latency: 82ms</span>
          <span className="text-slate-600">•</span>
          <span>48 kHz</span>
        </div>
      </div>
    </div>
  );
}
