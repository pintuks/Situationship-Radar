const FASTROUTER_BASE_URL = "https://go.fastrouter.ai/api/v1";
const DEFAULT_MODEL = "anthropic/claude-4.5-sonnet";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface FastRouterChoice {
  message?: {
    content?: string;
  };
}

interface FastRouterResponse {
  choices?: FastRouterChoice[];
  error?: {
    message?: string;
  };
}

const getRequiredEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const getFastRouterConfig = () => ({
  apiKey: getRequiredEnv("FASTROUTER_API_KEY"),
  model: process.env.FASTROUTER_MODEL ?? DEFAULT_MODEL,
  baseUrl: process.env.FASTROUTER_BASE_URL ?? FASTROUTER_BASE_URL,
});

export const createFastRouterCompletion = async (messages: ChatMessage[]) => {
  const { apiKey, model, baseUrl } = getFastRouterConfig();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, temperature: 0.3 }),
  });

  const payload = (await response.json().catch(() => null)) as FastRouterResponse | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? "FastRouter request failed");
  }

  const content = payload?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("FastRouter returned an empty completion");
  }

  return content;
};
