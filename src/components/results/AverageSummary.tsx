import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Card, CardContent } from "@/components/ui/card";
import type { SentimentLabel } from "@/utils/sentiment";

interface AverageSummaryProps {
  score: number; // 0-100
  label: SentimentLabel;
}

const labelText: Record<SentimentLabel, string> = {
  positive: "Uplifting 🌈",
  neutral: "Steady ☁️",
  negative: "A tough day? We’re here for you 💙",
};

export function AverageSummary({ score, label }: AverageSummaryProps) {
  useEffect(() => {
    if (label === "positive") {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.3 } });
    }
  }, [label]);

  return (
    <Card className={`${label === "positive" ? "summary-positive" : label === "neutral" ? "summary-neutral" : "summary-negative"} animate-fade-in`}> 
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Overall mood</h2>
            <p className="text-muted-foreground mt-1">{labelText[label]}</p>
          </div>
          <div className="min-w-[180px]">
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full progress-spectrum"
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="text-right mt-1 text-sm text-muted-foreground">{score}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
