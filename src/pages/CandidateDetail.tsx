import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  Link as LinkIcon, 
  Star, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  Award
} from "lucide-react";
import { Candidate } from "@/types/candidate";
import { format } from "date-fns";
import { toast } from "sonner";

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading - in production, fetch from API
    setTimeout(() => {
      // Mock data - replace with actual API call
      const mockCandidate: Candidate = {
        id: id || "1",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 123-4567",
        position: "Senior Frontend Developer",
        seniorityLevel: "senior",
        status: "completed",
        interviewLink: "https://interview.ai/abc123",
        linkExpiry: new Date(Date.now() + 86400000),
        emailSentAt: new Date(Date.now() - 3600000),
        interviewCompletedAt: new Date(Date.now() - 1800000),
        transcript: "AI: Hello Sarah, thank you for joining us today. Let's start with your experience with React and modern frontend frameworks.\n\nCandidate: Thank you for having me. I've been working with React for over 6 years now, and I'm very comfortable with hooks, context API, and state management libraries like Redux and Zustand.\n\nAI: That's impressive. Can you tell me about a challenging problem you've solved recently?\n\nCandidate: Sure! Recently, I optimized our application's performance by implementing code splitting and lazy loading, which reduced our initial bundle size by 40% and improved our Lighthouse score from 65 to 92.",
        summary: "Strong technical background with 6+ years in React. Excellent communication skills. Shows deep understanding of modern frontend architecture, performance optimization, and best practices. Demonstrated problem-solving abilities with concrete examples. Would be a great fit for senior-level positions.",
        score: 8.5,
      };
      setCandidate(mockCandidate);
      setLoading(false);
    }, 1200);
  }, [id]);

  const handleMoveToNextLevel = () => {
    toast.success("Candidate moved to next level", {
      description: `${candidate?.name} has been advanced in the hiring process.`,
    });
    navigate("/");
  };

  const handleReject = () => {
    toast.error("Candidate rejected", {
      description: `${candidate?.name} has been rejected.`,
    });
    navigate("/");
  };

  const getSeniorityBadge = (level: string) => {
    const colors = {
      junior: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      mid: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      senior: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      lead: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
      executive: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    };
    return colors[level as keyof typeof colors] || colors.mid;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onUploadClick={() => {}} />
        <main className="container mx-auto px-6 py-8 max-w-5xl">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="space-y-6">
            <Card className="p-8">
              <Skeleton className="h-8 w-64 mb-4" />
              <Skeleton className="h-4 w-48 mb-8" />
              <div className="grid grid-cols-2 gap-6 mb-6">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
              <Skeleton className="h-32 mb-6" />
              <Skeleton className="h-64" />
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background">
        <Header onUploadClick={() => {}} />
        <main className="container mx-auto px-6 py-8 max-w-5xl">
          <p className="text-muted-foreground">Candidate not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onUploadClick={() => {}} />
      
      <main className="container mx-auto px-6 py-8 max-w-5xl animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-8 group hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:animate-pulse" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          {/* Header Card */}
          <Card className="p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-from-top border-2">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">{candidate.name}</h1>
                  <Badge 
                    className={`${getSeniorityBadge(candidate.seniorityLevel)} border animate-bounce-in`}
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {candidate.seniorityLevel.charAt(0).toUpperCase() + candidate.seniorityLevel.slice(1)}
                  </Badge>
                </div>
                <p className="text-xl text-muted-foreground mb-1">{candidate.position}</p>
                {candidate.status === "completed" && (
                  <div className="flex items-center gap-2 text-success mt-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Interview Completed</span>
                  </div>
                )}
              </div>
              {candidate.score && (
                <div className="flex flex-col items-center gap-2 bg-gradient-to-br from-primary/10 to-primary-glow/10 px-6 py-4 rounded-2xl border-2 border-primary/20 animate-bounce-in shadow-glow-md">
                  <Star className="w-6 h-6 text-primary fill-primary animate-pulse" />
                  <span className="text-3xl font-bold text-primary">{candidate.score}</span>
                  <span className="text-xs text-muted-foreground">out of 10</span>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{candidate.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{candidate.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Position</p>
                  <p className="text-sm font-medium text-foreground">{candidate.position}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Link Expires</p>
                  <p className="text-sm font-medium text-foreground">
                    {format(candidate.linkExpiry, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Interview Link Card */}
          <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 animate-slide-in-from-left">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-primary" />
              Interview Link
            </h3>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-sm bg-muted px-4 py-3 rounded-lg border">
                {candidate.interviewLink}
              </code>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(candidate.interviewLink);
                  toast.success("Link copied to clipboard!");
                }}
                className="hover:scale-105 transition-transform"
              >
                Copy
              </Button>
            </div>
          </Card>

          {/* AI Summary Card */}
          {candidate.summary && (
            <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 animate-slide-in-from-right border-l-4 border-l-success">
              <h3 className="text-lg font-semibold text-foreground mb-4">AI Summary</h3>
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-6 border">
                <p className="text-foreground leading-relaxed">{candidate.summary}</p>
              </div>
            </Card>
          )}

          {/* Transcript Card */}
          {candidate.transcript && (
            <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300 animate-slide-in-from-bottom">
              <h3 className="text-lg font-semibold text-foreground mb-4">Interview Transcript</h3>
              <div className="bg-muted/50 rounded-xl p-6 max-h-96 overflow-y-auto border">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono">
                  {candidate.transcript}
                </p>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <Card className="p-6 shadow-lg animate-bounce-in border-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleReject}
                variant="destructive"
                size="lg"
                className="flex-1 group hover:shadow-lg transition-all duration-300"
              >
                <XCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                Reject Candidate
              </Button>
              <Button
                onClick={handleMoveToNextLevel}
                size="lg"
                className="flex-1 bg-gradient-to-r from-success to-success-glow hover:shadow-success-glow transition-all duration-300 group"
              >
                Move to Next Level
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CandidateDetail;
