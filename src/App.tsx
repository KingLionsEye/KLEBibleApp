import { useState } from "react";
import type { FormEvent } from "react";
import "./App.css";
import { askKingLionsEye } from "./services/geminiService";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!question.trim()) return;

    setLoading(true);
    try {
      const result = await askKingLionsEye(
        `You are King Lion's Eye, a gentle Bible study companion.
        Answer this question with scripture references and encouragement:\n\n${question}`
      );
      setAnswer(result);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : JSON.stringify(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-4">
      <div className="w-full max-w-2xl bg-slate-800/80 rounded-xl shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center mb-2">
          King Lion&apos;s Eye • Bible Companion
        </h1>

        <form onSubmit={handleAsk} className="space-y-3">
          <label className="block text-sm font-medium mb-1">
            Ask a Bible question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-28 rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Example: What does the Bible say about trusting God when I'm anxious?"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-medium bg-amber-400 text-slate-900 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Listening..." : "Ask King Lion's Eye"}
          </button>
        </form>

        {error && (
          <div className="text-sm text-red-400 border border-red-500/60 rounded-md p-2 mt-2">
            <strong>Error:</strong> {error}
          </div>
        )}

        {answer && (
          <div className="mt-4 border border-slate-700 rounded-lg p-3 text-sm whitespace-pre-wrap leading-relaxed">
            {answer}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
