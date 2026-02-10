"use client";

import { FormEvent } from "react";
import { Lock, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ChatInputCardProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const samples = [
  "They send 'good morning ☀️' at 11:58am, like it's an emotional brunch.",
  "Said 'I miss you' then vanished 3 days. Is this romance or hide-and-seek?",
  "Met their friends, not their intentions. It's giving premium confusion.",
];

export function ChatInputCard({ value, loading, onChange, onSubmit }: ChatInputCardProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Card className="rounded-3xl border-white/40 bg-white/40 shadow-xl backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900">Drop the chat lore</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chat-input" className="text-sm font-medium text-slate-700">
              What happened?
            </Label>
            <textarea
              id="chat-input"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Example: 'We talk nightly but they still call me bestie. Be so serious.'"
              className="min-h-36 w-full rounded-2xl border border-rose-200 bg-white/90 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {samples.map((sample) => (
              <Button
                key={sample}
                type="button"
                variant="outline"
                className="btn-lift rounded-full border-rose-200 bg-white/80 text-xs text-rose-700 hover:bg-rose-50"
                onClick={() => onChange(sample)}
              >
                {sample}
              </Button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-xs text-slate-600">
              <Lock className="h-3.5 w-3.5" />
              Privacy mode: analyzed in-session, not permanently stored.
            </p>
            <Button
              type="submit"
              disabled={loading || !value.trim()}
              className="btn-lift relative min-w-44 overflow-hidden rounded-full bg-rose-600 text-white hover:bg-rose-500"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {loading ? "Reading the room..." : "Analyze Situationship"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
