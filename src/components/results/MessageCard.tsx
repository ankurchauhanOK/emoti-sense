import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SentimentLabel } from "@/utils/sentiment";

interface MessageCardProps {
  text: string;
  label: SentimentLabel;
  score: number; // 0-100
}

const emojiFor: Record<SentimentLabel, string> = {
  positive: "😊",
  neutral: "😐",
  negative: "😔",
};

export function MessageCard({ text, label, score }: MessageCardProps) {
  const badgeClass =
    label === "positive" ? "badge-positive" : label === "neutral" ? "badge-neutral" : "badge-negative";

  return (
    <Card className="glass-card animate-enter hover-scale">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={badgeClass}>
            <span className="font-semibold capitalize">{label}</span>
          </Badge>
          <span className="text-2xl" aria-hidden>{emojiFor[label]}</span>
        </div>

        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{text}</p>

        <div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div className="h-full progress-spectrum" style={{ width: `${score}%` }} />
          </div>
          <div className="mt-1 text-xs text-muted-foreground text-right">{score}%</div>
        </div>
      </CardContent>
    </Card>
  );
}
