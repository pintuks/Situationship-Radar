"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/radar/ToastProvider";

interface ShareCardModalProps {
  score: number;
  label: string;
  topInsight: string;
}

export function ShareCardModal({ score, label, topInsight }: ShareCardModalProps) {
  const { pushToast } = useToast();

  const handleCopy = async () => {
    const payload = `Situationship Radar 💘📡\nScore: ${score}%\nLabel: ${label}\nInsight: ${topInsight}`;
    await navigator.clipboard.writeText(payload);
    pushToast("Share text copied.");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-lift rounded-full bg-slate-900 text-white hover:bg-slate-800">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-3xl border-white/30 bg-white/95 p-5">
        <DialogHeader>
          <DialogTitle>Share your radar result</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 rounded-2xl border border-rose-100 bg-white p-4 text-sm text-slate-700">
          <p className="font-semibold">Score: {score}%</p>
          <p className="font-semibold">Label: {label}</p>
          <p>“{topInsight}”</p>
        </div>
        <Button onClick={handleCopy} className="btn-lift w-full rounded-full bg-rose-600 text-white hover:bg-rose-500">
          Copy share text
        </Button>
      </DialogContent>
    </Dialog>
  );
}
