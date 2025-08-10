import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { AverageSummary } from "@/components/results/AverageSummary";
import { MessageCard } from "@/components/results/MessageCard";
import { InsightsPanel } from "@/components/results/InsightsPanel";
import { analyzeMessages, type MessageResult } from "@/utils/sentiment";

function parseInput(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  try {
    const json = JSON.parse(trimmed);
    if (Array.isArray(json)) {
      return json.map((x) => String(x)).filter((s) => s.trim().length > 0);
    }
  } catch {}
  return trimmed
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const demoMessages = [
  "I’m grateful for my friends. Today felt light and productive!",
  "Kinda anxious about tomorrow’s meeting but I’ll prepare well.",
  "Honestly, I’m tired and disappointed about that result.",
];

const Index = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MessageResult[]>([]);
  const [average, setAverage] = useState<{ score: number; label: "positive" | "neutral" | "negative" } | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = "AI Emotional Insights Assistant | Instant Mood Analysis";
  }, []);

  const handleAnalyze = () => {
    const messages = parseInput(input);
    if (messages.length === 0) return;
    setLoading(true);
    const { results, average } = analyzeMessages(messages);
    setResults(results);
    setAverage(average);
    setLoading(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const text = await file.text();
    setInput(text);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setInput(text);
  };

  const tryDemo = () => {
    setInput(demoMessages.join("\n"));
    setTimeout(handleAnalyze, 50);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-hero" aria-hidden />
      <div className="blob w-72 h-72 top-10 left-4 animate-blob" />
      <div className="blob w-80 h-80 top-40 right-8 animate-blob" />
      <div className="blob w-64 h-64 bottom-10 left-1/3 animate-blob" />

      <main className="relative z-10 container mx-auto px-4 py-16">
        <header className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            AI Emotional Insights Assistant — Check How You Feel, Instantly.
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Type your thoughts, paste chat logs, or upload a file to see your mood.
          </p>
        </header>

        {/* Input area */}
        <Card
          className="glass-card max-w-3xl mx-auto p-4 sm:p-6 animate-enter"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          aria-label="Input area: type or drop a file"
        >
          <div className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write how you feel... Or paste multiple lines / JSON array."
              className="min-h-[160px]"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  variant="hero"
                  onClick={handleAnalyze}
                  className="px-8"
                  disabled={loading || !input.trim()}
                >
                  {loading ? "Analyzing..." : "Analyze"}
                </Button>
                <Button size="lg" variant="glow" onClick={tryDemo} className="px-6">
                  Try demo
                </Button>
              </div>
              <div className="flex-1 text-sm text-muted-foreground sm:text-right">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="file" accept=".txt,.md,.json,.csv" onChange={onFileChange} className="hidden" />
                  <span className="underline story-link">or upload a file</span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Results */}
        <section ref={resultsRef} className="max-w-5xl mx-auto mt-12 space-y-6">
          {average && <AverageSummary score={average.score} label={average.label} />}
          {average && <InsightsPanel label={average.label} />}

          {results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((r, i) => (
                <MessageCard key={i} text={r.text} label={r.label} score={r.score} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
