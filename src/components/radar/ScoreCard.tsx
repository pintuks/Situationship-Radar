import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ScoreCardProps {
  score: number;
  label: string;
}

const labelTone: Record<string, string> = {
  "Green Flag ✅": "bg-emerald-100 text-emerald-700",
  "Mild Delulu 😌": "bg-amber-100 text-amber-800",
  "Situationship Core 💀": "bg-orange-100 text-orange-800",
  "Breadcrumb Buffet 🍞": "bg-rose-100 text-rose-700",
  "CEO of Delulu 🫡": "bg-fuchsia-100 text-fuchsia-700",
};

export function ScoreCard({ score, label }: ScoreCardProps) {
  const clamped = Math.max(0, Math.min(100, score));

  return (
    <Card className="rounded-3xl border-white/40 bg-white/45 shadow-xl backdrop-blur-lg">
      <CardContent className="flex flex-col items-center gap-6 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Radar Score</h3>

        <div
          className="relative grid h-36 w-36 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#f43f5e ${clamped * 3.6}deg, #ffe4ec ${clamped * 3.6}deg)`,
          }}
        >
          <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-slate-900 shadow-inner">
            <p className="text-4xl font-black">{clamped}</p>
          </div>
        </div>

        <Badge className={`rounded-full px-4 py-1.5 text-sm ${labelTone[label] ?? "bg-slate-100 text-slate-700"}`}>{label}</Badge>
        <p className="text-center text-sm text-slate-600">Probability of mixed signals currently detected.</p>
      </CardContent>
    </Card>
  );
}
