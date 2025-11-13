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
      color: "from-blue-500/20 to-blue-600/10",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-500/30",
      shadowColor: "shadow-blue-500/20",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      description: "Interviews finished",
      color: "from-success/20 to-success-glow/10",
      iconBg: "bg-success/10",
      iconColor: "text-success",
      borderColor: "border-success/30",
      shadowColor: "shadow-success/20",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      description: "Currently interviewing",
      color: "from-warning/20 to-warning/10",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      borderColor: "border-warning/30",
      shadowColor: "shadow-warning/20",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: UserCheck,
      description: "Awaiting interview",
      color: "from-primary/20 to-primary-glow/10",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      borderColor: "border-primary/30",
      shadowColor: "shadow-primary/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={`p-6 hover:shadow-glass-xl hover:scale-110 transition-all duration-500 cursor-pointer border border-white/20 glass backdrop-blur-lg ${card.borderColor} animate-pop relative overflow-hidden group rounded-3xl`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Animated background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl group-hover:translate-x-10 group-hover:translate-y-10 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${card.iconBg} rounded-xl group-hover:scale-125 group-hover:shadow-glow-md transition-all duration-300 shadow-sm`}>
                  <Icon className={`w-6 h-6 ${card.iconColor} group-hover:animate-float`} />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {card.value}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                  {card.description}
                </p>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-glow animate-gradient-shift"
                  style={{
                    width: `${(card.value / stats.total) * 100}%`,
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
