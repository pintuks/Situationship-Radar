import { NextResponse } from "next/server";
import { createFastRouterCompletion } from "@/lib/fastrouter";

interface AnalyzePayload {
  text?: string;
}

interface Signal {
  title: string;
  score: number;
  reason: string;
}

interface AnalyzeResponse {
  score: number;
  label: string;
  signals: Signal[];
}

const labelByScore = (score: number) => {
  if (score <= 20) return "Green Flag ✅";
  if (score <= 40) return "Mild Delulu 😌";
  if (score <= 60) return "Situationship Core 💀";
  if (score <= 80) return "Breadcrumb Buffet 🍞";
  return "CEO of Delulu 🫡";
};

const normalizeSignals = (signals: Signal[]) =>
  signals
    .filter((signal) => signal?.title && signal?.reason)
    .slice(0, 5)
    .map((signal) => ({
      title: signal.title,
      reason: signal.reason,
      score: Math.max(0, Math.min(100, Number(signal.score) || 0)),
    }));

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as AnalyzePayload | null;
  const text = body?.text?.trim();

  if (!text) {
    return NextResponse.json({ error: "Message text is required." }, { status: 400 });
  }

  try {
    const completion = await createFastRouterCompletion([
      {
        role: "system",
        content:
          "You analyze dating conversation behavior for situationship patterns. Return only valid JSON with this schema: {\"score\": number 0-100, \"signals\": [{\"title\": string, \"score\": number 0-100, \"reason\": string}]}. Include exactly 5 signals. Do not include markdown.",
      },
      {
        role: "user",
        content: `Analyze this chat context and score relationship ambiguity:\n\n${text}`,
      },
    ]);

    const parsed = JSON.parse(completion) as Partial<AnalyzeResponse>;
    const safeScore = Math.max(0, Math.min(100, Number(parsed.score) || 0));
    const safeSignals = normalizeSignals((parsed.signals ?? []) as Signal[]);

    if (safeSignals.length === 0) {
      throw new Error("No valid signals returned");
    }

    return NextResponse.json({
      score: safeScore,
      label: labelByScore(safeScore),
      signals: safeSignals,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to analyze message.",
      },
      { status: 500 },
    );
  }
}
