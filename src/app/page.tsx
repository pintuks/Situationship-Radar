"use client";

import { useRef, useState } from "react";
import { RadarHero } from "@/components/radar/RadarHero";
import { ChatInputCard } from "@/components/radar/ChatInputCard";
import { Footer } from "@/components/radar/Footer";
import { Signal, SignalBars } from "@/components/radar/SignalBars";
import { MemeInsights } from "@/components/radar/MemeInsights";
import { ReplySet, ReplySuggestions } from "@/components/radar/ReplySuggestions";
import { RevealPhase, RevealSequence } from "@/components/radar/RevealSequence";
import { FloatingHeartsBackground } from "@/components/radar/FloatingHeartsBackground";
import { ToastProvider } from "@/components/radar/ToastProvider";

interface AnalyzeResponse {
  score: number;
  label: string;
  signals: Signal[];
}

interface GenerateResponse {
  meme_insights: string[];
  reply_suggestions: string[];
}

const defaultInsights = [
  "They text like a movie trailer: dramatic hook, no full release date.",
  "You&apos;re not overthinking — the signals are literally doing parkour.",
  "If consistency were a language, they only speak it on holidays.",
];

const defaultReplies: ReplySet = {
  soft: [
    "I enjoy talking to you. Can we get clear about what this is becoming?",
    "Clarity helps me show up better — where do you see this going?",
  ],
  playful: [
    "Mini vibe audit: are we dating, orbiting, or in a limited series?",
    "My planner wants to know if this is a relationship or a plot twist.",
  ],
  savage: [
    "I don&apos;t subscribe to mixed signals. If it&apos;s casual, say it clearly.",
    "Confusion is my cue to choose clarity. What are we doing here?",
  ],
};

const labelByScore = (score: number) => {
  if (score <= 20) return "Green Flag ✅";
  if (score <= 40) return "Mild Delulu 😌";
  if (score <= 60) return "Situationship Core 💀";
  if (score <= 80) return "Breadcrumb Buffet 🍞";
  return "CEO of Delulu 🫡";
};

export default function HomePage() {
  const inputRef = useRef<HTMLDivElement>(null);
  const [chatInput, setChatInput] = useState("");
  const [phase, setPhase] = useState<RevealPhase>("idle");
  const [confettiKey, setConfettiKey] = useState(0);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [insights, setInsights] = useState<string[]>(defaultInsights);
  const [suggestions, setSuggestions] = useState<ReplySet>(defaultReplies);

  const scrollToInput = () => inputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleAnalyze = async () => {
    if (!chatInput.trim()) return;

    setPhase("loading");

    try {
      const [analyzeRes, generateRes] = await Promise.all([
        fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: chatInput }),
        }),
        fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: chatInput }),
        }),
      ]);

      const analyzeData = (await analyzeRes.json().catch(() => null)) as AnalyzeResponse | null;
      const generateData = (await generateRes.json().catch(() => null)) as GenerateResponse | null;

      const score = analyzeData?.score ?? Math.floor(Math.random() * 70) + 22;
      const signals =
        analyzeData?.signals?.length
          ? analyzeData.signals
          : [
              { title: "Inconsistent timing", score: 82, reason: "Fast replies when bored, radio silence when it counts." },
              { title: "Future-plan fog", score: 74, reason: "Talks about someday, avoids actual dates." },
              { title: "Affection spikes", score: 66, reason: "Warmth appears in bursts then disappears." },
              { title: "Bestie-coded flirting", score: 57, reason: "Romance energy wrapped in plausible deniability." },
              { title: "Effort imbalance", score: 78, reason: "You initiate most of the momentum." },
            ];

      setAnalysis({
        score,
        label: analyzeData?.label ?? labelByScore(score),
        signals,
      });

      setInsights(generateData?.meme_insights?.length ? generateData.meme_insights.slice(0, 3) : defaultInsights);

      const generated = generateData?.reply_suggestions?.slice(0, 6) ?? [];
      if (generated.length >= 6) {
        setSuggestions({
          soft: generated.slice(0, 2),
          playful: generated.slice(2, 4),
          savage: generated.slice(4, 6),
        });
      } else {
        setSuggestions(defaultReplies);
      }

      setPhase("drumroll");
      window.setTimeout(() => {
        setPhase("result");
        setConfettiKey((prev) => prev + 1);
      }, 700);
    } catch {
      setPhase("result");
      setAnalysis({
        score: 55,
        label: "Situationship Core 💀",
        signals: [
          { title: "Signal turbulence", score: 64, reason: "Network of feelings detected with low clarity." },
          { title: "Hot/cold cadence", score: 61, reason: "High intensity, low consistency pattern." },
          { title: "Label avoidance", score: 73, reason: "Connection exists, definition does not." },
          { title: "Context switching", score: 52, reason: "Tone shifts depending on convenience." },
          { title: "Ambiguous commitment", score: 58, reason: "Present vibes, future uncertainty." },
        ],
      });
    }
  };

  const loading = phase === "loading" || phase === "drumroll";
  const hasResult = phase === "result" && analysis;

  return (
    <ToastProvider>
      <main className="relative min-h-screen overflow-hidden">
        <FloatingHeartsBackground />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
          <RadarHero onScrollToInput={scrollToInput} />

          <section ref={inputRef} className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
            <ChatInputCard value={chatInput} onChange={setChatInput} onSubmit={handleAnalyze} loading={loading} />
            <RevealSequence phase={phase} score={analysis?.score ?? 0} label={analysis?.label ?? "Awaiting chaos report"} confettiKey={confettiKey} />
          </section>

          <section className={`grid gap-4 transition-all duration-500 ${hasResult ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"}`}>
            <SignalBars signals={analysis?.signals ?? []} loading={!hasResult} />
            <MemeInsights insights={insights} loading={!hasResult} />
            <ReplySuggestions suggestions={suggestions} loading={!hasResult} />
          </section>

          <Footer />
        </div>
      </main>
    </ToastProvider>
  );
}
