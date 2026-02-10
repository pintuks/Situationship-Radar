"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface Signal {
  title: string;
  score: number;
  reason: string;
}

interface SignalBarsProps {
  signals: Signal[];
  loading?: boolean;
}

export function SignalBars({ signals, loading }: SignalBarsProps) {
  return (
    <Card className="rounded-3xl border-white/40 bg-white/40 shadow-xl backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">Top Detected Signals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-44 rounded-md bg-white/80" />
              <div className="relative h-3 overflow-hidden rounded-full bg-rose-100 animate-shimmer" />
            </div>
          ))
        ) : (
          <TooltipProvider>
            {signals.slice(0, 5).map((signal) => (
              <Tooltip key={signal.title}>
                <TooltipTrigger asChild>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{signal.title}</span>
                      <span className="text-slate-500">{signal.score}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-rose-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 transition-[width] duration-700 ease-out"
                        style={{ width: `${Math.max(0, Math.min(100, signal.score))}%` }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-64 rounded-xl bg-slate-900 text-white">
                  <p>{signal.reason}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
}
