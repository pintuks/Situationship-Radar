"use client";

import { Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/radar/ToastProvider";

export interface ReplySet {
  soft: string[];
  playful: string[];
  savage: string[];
}

interface ReplySuggestionsProps {
  suggestions: ReplySet;
  loading?: boolean;
}

export function ReplySuggestions({ suggestions, loading }: ReplySuggestionsProps) {
  const { pushToast } = useToast();

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    pushToast("Reply copied to clipboard.");
  };

  return (
    <Card className="rounded-3xl border-white/40 bg-white/40 shadow-xl backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">Reply Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="soft" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 rounded-full bg-rose-100/80">
            <TabsTrigger value="soft" className="rounded-full">
              Soft
            </TabsTrigger>
            <TabsTrigger value="playful" className="rounded-full">
              Playful
            </TabsTrigger>
            <TabsTrigger value="savage" className="rounded-full">
              Savage
            </TabsTrigger>
          </TabsList>

          {(["soft", "playful", "savage"] as const).map((tone) => (
            <TabsContent key={tone} value={tone} className="space-y-3">
              {loading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="relative h-16 overflow-hidden rounded-2xl border border-rose-100 bg-white/85 p-3 animate-shimmer" />
                  ))
                : suggestions[tone].map((line) => (
                    <div key={line} className="flex items-start justify-between gap-3 rounded-2xl border border-rose-100 bg-white/85 p-3">
                      <p className="text-sm text-slate-700">{line}</p>
                      <Button size="icon" variant="ghost" className="btn-lift rounded-full" onClick={() => handleCopy(line)}>
                        <Copy className="h-4 w-4 text-slate-500" />
                      </Button>
                    </div>
                  ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
