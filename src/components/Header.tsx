import { Button } from "@/components/ui/button";
import { Upload, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onUploadClick: () => void;
}

export const Header = ({ onUploadClick }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="glass glass-dark sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative w-12 h-12 rounded-2xl bg-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <BarChart3 className="w-6 h-6 text-foreground group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Voice First
              </h1>
            </div>
          </div>

          <Button
            onClick={onUploadClick}
            className="bg-primary hover:bg-primary/90 transition-all duration-300 rounded-2xl font-semibold cursor-pointer"
          >
            <span>Add Candidate</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
