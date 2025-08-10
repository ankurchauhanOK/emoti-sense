import Sentiment from "sentiment";

export type SentimentLabel = "positive" | "neutral" | "negative";

export interface MessageResult {
  text: string;
  label: SentimentLabel;
  score: number; // 0-100
  comparative: number; // -1..1 approx
}

const analyzer = new Sentiment();

export function labelFromComparative(c: number): SentimentLabel {
  if (c >= 0.2) return "positive";
  if (c <= -0.2) return "negative";
  return "neutral";
}

function normalizeComparativeToPercent(c: number): number {
  const pct = ((c + 1) / 2) * 100; // map -1..1 → 0..100
  return Math.max(0, Math.min(100, Math.round(pct)));
}

export function analyzeMessages(messages: string[]) {
  const results: MessageResult[] = messages.map((text) => {
    const res = analyzer.analyze(text);
    const comparative = (res as any).comparative ?? 0;
    const label = labelFromComparative(comparative);
    const score = normalizeComparativeToPercent(comparative);
    return { text, comparative, label, score };
  });

  const avgComparative =
    results.reduce((acc, r) => acc + r.comparative, 0) / (results.length || 1);
  const average = {
    label: labelFromComparative(avgComparative),
    score: normalizeComparativeToPercent(avgComparative),
  } as { label: SentimentLabel; score: number };

  return { results, average };
}
