import { Button } from "@/components/ui/button";
import { Upload, BarChart3 } from "lucide-react";

interface HeaderProps {
  onUploadClick: () => void;
}

export const Header = ({ onUploadClick }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">RecruitAI</h1>
              <p className="text-xs text-muted-foreground">Automated Screening</p>
            </div>
          </div>
          
          <Button onClick={onUploadClick} className="gap-2">
            <Upload className="w-4 h-4" />
            Add Candidates
          </Button>
        </div>
      </div>
    </header>
  );
};
