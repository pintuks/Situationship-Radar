"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreCard } from "@/components/radar/ScoreCard";
import { ConfettiBurst } from "@/components/radar/ConfettiBurst";

export type RevealPhase = "idle" | "loading" | "drumroll" | "result";

interface RevealSequenceProps {
  phase: RevealPhase;
  score: number;
  label: string;
  confettiKey: number;
}

const statusLines = [
  "Checking red flags per paragraph...",
  "Measuring breadcrumb density...",
  "Running delulu calibration...",
  "Consulting emotionally unavailable oracle...",
];

export function RevealSequence({ phase, score, label, confettiKey }: RevealSequenceProps) {
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (phase !== "loading") return;
    const timer = window.setInterval(() => {
      setLineIdx((prev) => (prev + 1) % statusLines.length);
    }, 820);
    return () => window.clearInterval(timer);
  }, [phase]);

  const currentLine = useMemo(() => statusLines[lineIdx], [lineIdx]);

  if (phase === "loading") {
    return (
      <Card className="relative rounded-3xl border-white/40 bg-white/45 shadow-xl backdrop-blur-lg">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Loader2 className="h-4 w-4 animate-spin" />
            Vibe Meter in progress
          </div>
          <div className="h-3 rounded-full bg-rose-100 p-0.5">
            <div className="animate-pulse-bar h-full rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-500" />
          </div>
          <p className="min-h-5 text-sm text-slate-600" aria-live="polite">
            {currentLine}
          </p>
          <div className="relative h-20 overflow-hidden rounded-2xl border border-white/50 bg-white/80 animate-shimmer" />
        </CardContent>
      </Card>
    );
  }

  if (phase === "drumroll") {
    return (
      <Card className="rounded-3xl border-white/40 bg-white/45 shadow-xl backdrop-blur-lg">
        <CardContent className="p-6">
          <div className="rounded-2xl border border-rose-100 bg-white/80 p-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Drumroll...</p>
            <p className="mt-3 text-5xl font-black text-slate-900 blur-md">{score}</p>
            <p className="mt-2 text-sm text-slate-600">Preparing your emotional weather report</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (phase === "result") {
    return (
      <div className="relative animate-pop-in">
        <ScoreCard score={score} label={label} />
        <ConfettiBurst trigger={confettiKey} />
      </div>
    );
  }

  return <ScoreCard score={0} label="Awaiting chaos report" />;
}
