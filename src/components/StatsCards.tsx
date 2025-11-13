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
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      description: "Interviews finished",
      color: "from-success/20 to-success-glow/10",
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      description: "Currently interviewing",
      color: "from-warning/20 to-warning/10",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: UserCheck,
      description: "Awaiting interview",
      color: "from-primary/20 to-primary-glow/10",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={`p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 bg-gradient-to-br ${card.color} animate-fade-in relative overflow-hidden group`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-card/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${card.iconBg} rounded-xl group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <Badge 
                  variant="secondary" 
                  className="text-2xl font-bold px-4 py-2 bg-background/50 backdrop-blur-sm"
                >
                  {card.value}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{card.title}</h3>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
