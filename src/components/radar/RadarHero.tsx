import { HeartPulse, Sparkles, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RadarHeroProps {
  onScrollToInput: () => void;
}

export function RadarHero({ onScrollToInput }: RadarHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/35 p-6 shadow-2xl backdrop-blur-xl md:p-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-400/20 via-fuchsia-200/10 to-violet-400/20" />

      <div className="relative z-10 max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/80 px-3 py-1 text-xs font-semibold text-rose-700">
          <Sparkles className="h-3.5 w-3.5" />
          Chaotic Romance Intelligence™
        </div>

        <div className="space-y-4">
          <h1 className="text-balance text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            Situationship Radar <span className="text-rose-600">💘📡</span>
          </h1>
          <p className="max-w-2xl text-pretty text-base text-slate-700 md:text-lg">
            Paste the chat. We detect mixed signals, map your delulu level, and generate reply ideas that are emotionally smart +
            meme-delicious.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onScrollToInput} size="lg" className="btn-lift rounded-full bg-slate-900 px-7 text-white hover:bg-slate-800">
            <Radar className="mr-2 h-4 w-4" />
            Scan the Vibes
          </Button>
          <div className="inline-flex items-center gap-2 text-sm text-slate-600">
            <HeartPulse className="h-4 w-4 text-rose-500 animate-spin-slow" />
            Takes ~8 seconds • office-safe chaos
          </div>
        </div>
      </div>
    </section>
  );
}
