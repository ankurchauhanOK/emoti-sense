import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SentimentLabel } from "@/utils/sentiment";

interface InsightsPanelProps {
  label: SentimentLabel;
}

export function InsightsPanel({ label }: InsightsPanelProps) {
  if (label === "positive") return null;

  const content =
    label === "neutral"
      ? {
          title: "Keep going ✨",
          tip: "You seem balanced. Try a quick stretch or a short walk to keep energy flowing.",
        }
      : {
          title: "Be gentle with yourself 💙",
          tip: "Deep breath. Try writing one thing you're grateful for or texting a friend.",
        };

  return (
    <Card className="glass-card p-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Badge className={label === "neutral" ? "badge-neutral" : "badge-negative"}>{content.title}</Badge>
        <p className="text-sm text-muted-foreground">{content.tip}</p>
      </div>
    </Card>
  );
}
