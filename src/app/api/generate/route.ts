import { NextResponse } from "next/server";
import { createFastRouterCompletion } from "@/lib/fastrouter";
import { parseJsonFromCompletion } from "@/lib/json";

interface GeneratePayload {
  text?: string;
}

interface GenerateResponse {
  meme_insights: string[];
  reply_suggestions: string[];
}

const normalizeList = (items: string[], limit: number) =>
  items
    .filter((item) => typeof item === "string" && item.trim().length > 0)
    .slice(0, limit)
    .map((item) => item.trim());

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as GeneratePayload | null;
  const text = body?.text?.trim();

  if (!text) {
    return NextResponse.json({ error: "Message text is required." }, { status: 400 });
  }

  try {
    const completion = await createFastRouterCompletion([
      {
        role: "system",
        content:
          'You generate social media style dating insights. Return only valid JSON with this schema: {"meme_insights": string[3], "reply_suggestions": string[6]}. Keep suggestions concise, modern, and respectful. Do not include markdown.',
      },
      {
        role: "user",
        content: `Create insights and reply suggestions for this chat context:\n\n${text}`,
      },
    ]);

    const parsed = parseJsonFromCompletion(completion) as Partial<GenerateResponse>;
    const memeInsights = normalizeList((parsed.meme_insights ?? []) as string[], 3);
    const replySuggestions = normalizeList((parsed.reply_suggestions ?? []) as string[], 6);

    if (memeInsights.length === 0 || replySuggestions.length === 0) {
      throw new Error("Incomplete generation response");
    }

    return NextResponse.json({
      meme_insights: memeInsights,
      reply_suggestions: replySuggestions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate suggestions.",
      },
      { status: 500 },
    );
  }
}
