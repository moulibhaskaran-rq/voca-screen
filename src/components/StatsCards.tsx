import { Card } from "@/components/ui/card";
import { Users, CheckCircle2, Clock, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatsCardsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: "Total Candidates",
      value: stats.total,
      icon: Users,
      description: "All candidates in system",
      bgColor: "bg-primary/10",
      iconBg: "bg-primary/20",
      iconColor: "text-foreground",
      textColor: "text-foreground",
      borderColor: "border-primary/30",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      description: "Interviews finished",
      bgColor: "bg-success/10",
      iconBg: "bg-success/20",
      iconColor: "text-success",
      textColor: "text-success",
      borderColor: "border-success/30",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      description: "Currently interviewing",
      bgColor: "bg-warning/10",
      iconBg: "bg-warning/20",
      iconColor: "text-warning",
      textColor: "text-warning",
      borderColor: "border-warning/30",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: UserCheck,
      description: "Awaiting interview",
      bgColor: "bg-muted/50",
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
      textColor: "text-muted-foreground",
      borderColor: "border-muted/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={`p-6 hover:scale-[1.02] transition-all duration-500 cursor-pointer border-2 glass backdrop-blur-xl ${card.borderColor} animate-pop relative overflow-hidden group ${card.bgColor}`}
            style={{ animationDelay: `${index * 100}ms`, borderRadius: "1.5rem" }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-7 h-7 ${card.iconColor}`} />
                <div className="text-right">
                  <div className={`text-3xl font-bold ${card.textColor}`}>
                    {card.value}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className={`text-sm font-bold ${card.textColor}`}>
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  {card.description}
                </p>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 h-2 bg-border/50 rounded-full overflow-hidden border border-border/30">
                <div
                  className={`h-full transition-all duration-300`}
                  style={{
                    width: `${(card.value / stats.total) * 100}%`,
                    backgroundColor: card.iconColor.includes('primary') ? 'hsl(var(--primary))' :
                                   card.iconColor.includes('success') ? 'hsl(var(--success))' :
                                   card.iconColor.includes('warning') ? 'hsl(var(--warning))' :
                                   'hsl(var(--muted-foreground))'
                  }}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
