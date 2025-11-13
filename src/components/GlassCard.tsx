import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  animated?: boolean;
}

export const GlassCard = ({
  children,
  className = "",
  hover = true,
  animated = true,
}: GlassCardProps) => {
  return (
    <Card
      className={`glass backdrop-blur-xl rounded-3xl border border-white/20 ${
        hover ? "hover:shadow-glass-lg transition-all duration-300" : ""
      } ${animated ? "animate-fade-in" : ""} ${className}`}
    >
      {children}
    </Card>
  );
};

export const GlassContainer = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`glass backdrop-blur-xl rounded-3xl border border-white/20 shadow-glass-md ${className}`}
    >
      {children}
    </div>
  );
};
