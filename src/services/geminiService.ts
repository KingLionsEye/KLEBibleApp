// src/services/geminiService.ts
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_API_KEY as string | undefined;

if (!apiKey) {
  throw new Error("VITE_API_KEY is not set in your .env file");
}

// Create the Gemini client (official pattern from docs)
const ai = new GoogleGenAI({ apiKey });

// Gemini model to use
const MODEL_NAME = "gemini-2.0-flash";

export async function askKingLionsEye(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });

  // In the new SDK, text is a property, not a function
  const anyResp = response as any;
  if (typeof anyResp.text === "string") {
    return anyResp.text;
  }

  // Fallback for weird shapes: join parts
  if (anyResp.candidates?.length) {
    return anyResp.candidates
      .map((c: any) =>
        c.content?.parts?.map((p: any) => p.text ?? "").join("")
      )
      .join("\n\n");
  }

  // Last resort: dump JSON
  return JSON.stringify(response, null, 2);
}
