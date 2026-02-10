"use client";

import { Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/radar/ToastProvider";

interface MemeInsightsProps {
  insights: string[];
  loading?: boolean;
}

export function MemeInsights({ insights, loading }: MemeInsightsProps) {
  const { pushToast } = useToast();

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    pushToast("Insight copied. Go forth and post.");
  };

  return (
    <Card className="rounded-3xl border-white/40 bg-white/40 shadow-xl backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">Meme Insights</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <article key={idx} className="relative overflow-hidden rounded-2xl border border-rose-100 bg-white/90 p-4 shadow-sm animate-shimmer">
                <div className="h-4 w-5/6 rounded bg-rose-100" />
                <div className="mt-2 h-4 w-full rounded bg-rose-100" />
                <div className="mt-2 h-4 w-3/4 rounded bg-rose-100" />
              </article>
            ))
          : insights.slice(0, 3).map((insight) => (
              <article key={insight} className="flex flex-col justify-between rounded-2xl border border-rose-100 bg-white/90 p-4 shadow-sm">
                <p className="text-sm leading-relaxed text-slate-700">{insight}</p>
                <Button
                  variant="ghost"
                  className="btn-lift mt-4 justify-start rounded-xl px-0 text-rose-600 hover:bg-transparent hover:text-rose-500"
                  onClick={() => handleCopy(insight)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy line
                </Button>
              </article>
            ))}
      </CardContent>
    </Card>
  );
}
