import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
    score: number;
    size?: "sm" | "md" | "lg";
}

export function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
    const getScoreStyles = (score: number) => {
        if (score >= 80) return "bg-foreground text-background";
        if (score >= 60) return "border-foreground bg-background text-foreground";
        return "border-foreground/20 bg-background text-foreground opacity-50";
    };

    const sizeClasses = {
        sm: "px-2 py-1 text-xs",
        md: "px-4 py-2 text-xl",
        lg: "px-8 py-4 text-4xl",
    };

    return (
        <div
            className={cn(
                "font-[900] border-[3px] tracking-tighter uppercase italic transition-all duration-300",
                getScoreStyles(score),
                sizeClasses[size]
            )}
        >
            {score}<span className="text-[0.6em] not-italic ml-1">pts</span>
        </div>
    );
}
