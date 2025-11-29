import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_API_KEY as string | undefined;

if (!apiKey) {
  throw new Error("VITE_API_KEY is not set in your .env file");
}
const ai = new GoogleGenAI({ apiKey });

// Use a widely available Gemini model
const MODEL_NAME = "gemini-2.0-flash";

export async function askKingLionsEye(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });

  const anyResp = response as any;

  // New SDK: text is often a property
  if (typeof anyResp.text === "string") {
    return anyResp.text;
  }

  // Fallback: join candidate parts
  if (anyResp.candidates?.length) {
    return anyResp.candidates
      .map((c: any) =>
        c.content?.parts?.map((p: any) => p.text ?? "").join("")
      )
      .join("\n\n");
  }

  // Last resort: inspect raw JSON
  return JSON.stringify(response, null, 2);
}