import { Button } from "@/components/ui/button";
import { Upload, BarChart3 } from "lucide-react";

interface HeaderProps {
  onUploadClick: () => void;
}

export const Header = ({ onUploadClick }: HeaderProps) => {
  return (
    <header className="glass glass-dark shadow-glass-lg sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow-md group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-110">
              <BarChart3 className="w-6 h-6 text-primary-foreground group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                RecruitAI
              </h1>
              <p className="text-xs text-muted-foreground/80">AI-Powered Recruitment</p>
            </div>
          </div>

          <Button
            onClick={onUploadClick}
            className="gap-2 bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 rounded-2xl font-semibold"
          >
            <Upload className="w-4 h-4" />
            Add Candidates
          </Button>
        </div>
      </div>
    </header>
  );
};
