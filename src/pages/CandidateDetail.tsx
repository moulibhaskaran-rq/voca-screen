import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { UploadDialog } from "@/components/UploadDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DetailPageSkeleton } from "@/components/LoadingSkeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Award,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  UserX,
} from "lucide-react";
import { Candidate } from "@/types/candidate";
import { format } from "date-fns";
import { toast } from "sonner";

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

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
        transcript:
          "AI: Hello Sarah, thank you for joining us today. Let's start with your experience with React and modern frontend frameworks.\n\nCandidate: Thank you for having me. I've been working with React for over 6 years now, and I'm very comfortable with hooks, context API, and state management libraries like Redux and Zustand.\n\nAI: That's impressive. Can you tell me about a challenging problem you've solved recently?\n\nCandidate: Sure! Recently, I optimized our application's performance by implementing code splitting and lazy loading, which reduced our initial bundle size by 40% and improved our Lighthouse score from 65 to 92.",
        summary:
          "Strong technical background with 6+ years in React. Excellent communication skills. Shows deep understanding of modern frontend architecture, performance optimization, and best practices. Demonstrated problem-solving abilities with concrete examples. Would be a great fit for senior-level positions.",
        score: 8.5,
      };
      setCandidate(mockCandidate);
      setLoading(false);
    }, 1200);
  }, [id]);

  const handleMoveToNextLevel = () => {
    setShowApproveDialog(false);
    toast.success("Advanced to Next Round", {
      duration: 3000,
      closeButton: true,
      icon: (
        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center border-2 border-success/30">
          <Sparkles className="w-5 h-5 text-success fill-success" />
        </div>
      ),
    });
    setTimeout(() => navigate("/"), 1500);
  };

  const handleReject = () => {
    setShowRejectDialog(false);
    toast.error("Candidate Rejected", {
      duration: 3000,
      closeButton: true,
      icon: (
        <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center border-2 border-destructive/30">
          <UserX className="w-5 h-5 text-destructive" />
        </div>
      ),
    });
    setTimeout(() => navigate("/"), 1500);
  };

  const handleCopyLink = async () => {
    if (candidate?.interviewLink && !copied) {
      await navigator.clipboard.writeText(candidate.interviewLink);
      setCopied(true);
      toast.success("Link Copied", {
        duration: 2000,
        closeButton: true,
        icon: (
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center border-2 border-success/30">
            <Check className="w-4 h-4 text-success" strokeWidth={2.5} />
          </div>
        ),
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSeniorityBadge = (level: string) => {
    const colors = {
      junior:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30",
      mid: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/30",
      senior:
        "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/30",
      lead: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 hover:bg-pink-500/20 hover:border-pink-500/30",
      executive:
        "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20 hover:border-yellow-500/30",
    };
    return colors[level as keyof typeof colors] || colors.mid;
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) {
      // Excellent: 9-10 - Success (Green)
      return {
        bg: "bg-success/10",
        border: "border-success/20",
        text: "text-success",
        icon: "text-success fill-success",
      };
    } else if (score >= 7) {
      // Good: 7-8.9 - Primary (Yellow)
      return {
        bg: "bg-primary/10",
        border: "border-primary/20",
        text: "text-foreground",
        icon: "text-foreground",
      };
    } else if (score >= 5) {
      // Average: 5-6.9 - Warning (Amber)
      return {
        bg: "bg-warning/10",
        border: "border-warning/20",
        text: "text-warning",
        icon: "text-warning",
      };
    } else {
      // Poor: 0-4.9 - Destructive (Red)
      return {
        bg: "bg-destructive/10",
        border: "border-destructive/20",
        text: "text-destructive",
        icon: "text-destructive",
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onUploadClick={() => setUploadDialogOpen(true)} />
        <main className="container mx-auto px-6 py-8 max-w-5xl">
          <DetailPageSkeleton />
        </main>
        <UploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
        />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background">
        <Header onUploadClick={() => setUploadDialogOpen(true)} />
        <main className="container mx-auto px-6 py-8 max-w-5xl">
          <p className="text-muted-foreground">Candidate not found</p>
        </main>
        <UploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onUploadClick={() => setUploadDialogOpen(true)} />

      <main className="container mx-auto px-6 py-8 max-w-5xl animate-fade-in">
        {/* Top Navigation Bar with Actions */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-muted-foreground cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => setShowRejectDialog(true)}
              variant="destructive"
              size="default"
              className="group transition-all duration-300 cursor-pointer rounded-2xl"
            >
              <UserX className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
              Reject
            </Button>
            <Button
              onClick={() => setShowApproveDialog(true)}
              size="default"
              className="bg-success hover:bg-success/90 text-white transition-all duration-300 cursor-pointer rounded-2xl"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              <span>Move to Next Level</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform relative z-10" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Header Card */}
          <Card className="p-8 glass backdrop-blur-xl rounded-3xl transition-all duration-300 animate-slide-in-from-top border-2 border-white/30">

            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h1 className="text-4xl font-bold text-foreground truncate max-w-2xl">
                          {candidate.name}
                        </h1>
                      </TooltipTrigger>
                      {candidate.name.length > 30 && (
                        <TooltipContent>
                          <p>{candidate.name}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  <Badge
                    className={`${getSeniorityBadge(
                      candidate.seniorityLevel
                    )} border animate-bounce-in flex-shrink-0`}
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {candidate.seniorityLevel.charAt(0).toUpperCase() +
                      candidate.seniorityLevel.slice(1)}
                  </Badge>
                </div>
                <p className="text-xl text-muted-foreground mb-1 truncate font-medium">
                  {candidate.position}
                </p>
                {candidate.status === "completed" && (
                  <div className="flex items-center gap-2 text-success mt-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Interview Completed
                    </span>
                  </div>
                )}
              </div>
              {candidate.score && (
                <div
                  className={`flex flex-col items-center gap-2 ${
                    getScoreColor(candidate.score).bg
                  } px-6 py-4 rounded-2xl border-2 ${
                    getScoreColor(candidate.score).border
                  } animate-bounce-in`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      getScoreColor(candidate.score).icon
                    } animate-pulse`}
                  />
                  <span
                    className={`text-3xl font-bold ${
                      getScoreColor(candidate.score).text
                    }`}
                  >
                    {candidate.score}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    out of 10
                  </span>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl hover:bg-muted/70 transition-all group border border-white/10 hover:border-primary/30">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Email</p>
                  <p className="text-sm font-semibold text-foreground">
                    {candidate.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl hover:bg-muted/70 transition-all group border border-white/10 hover:border-primary/30">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-semibold text-foreground">
                    {candidate.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl hover:bg-muted/70 transition-all group border border-white/10 hover:border-primary/30">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Position</p>
                  <p className="text-sm font-semibold text-foreground">
                    {candidate.position}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl hover:bg-muted/70 transition-all group border border-white/10 hover:border-primary/30">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Link Expires</p>
                  <p className="text-sm font-semibold text-foreground">
                    {format(candidate.linkExpiry, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Summary Card */}
          {candidate.summary && (
            <Card className="p-6 glass backdrop-blur-xl rounded-3xl transition-all duration-300 animate-slide-in-from-right border-l-4 border-l-success border-2 border-white/30">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 tracking-tight">
                <div className="p-3 bg-success/20 rounded-xl">
                  <Star className="w-5 h-5 text-success" />
                </div>
                AI Summary
              </h3>
              <div className="glass backdrop-blur-md rounded-2xl p-6 border border-white/20 bg-success/5">
                <p className="text-foreground leading-relaxed text-base font-medium">
                  {candidate.summary}
                </p>
              </div>
            </Card>
          )}

          {/* Transcript Card */}
          {candidate.transcript && (
            <Card className="p-6 glass backdrop-blur-xl rounded-3xl transition-all duration-300 animate-slide-in-from-bottom border-2 border-white/30">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 tracking-tight">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Award className="w-5 h-5 text-foreground" />
                </div>
                Interview Transcript
              </h3>
              <div className="glass backdrop-blur-md rounded-2xl p-6 max-h-96 overflow-y-auto border border-white/20 hover:border-primary/20 transition-all bg-primary/5">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono font-medium">
                  {candidate.transcript}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Reject Confirmation Dialog */}
        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogContent className="border-destructive/30">
            <AlertDialogHeader>
              <div className="mx-auto mb-2 w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center border-2 border-destructive/30 relative">
                <div className="absolute inset-0 rounded-full bg-destructive/5 animate-ping"></div>
                <UserX
                  className="w-10 h-10 text-destructive relative z-10"
                  strokeWidth={2.5}
                />
              </div>
              <AlertDialogTitle className="text-foreground">
                Reject {candidate?.name}?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                This will permanently remove the candidate from your pipeline.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReject}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex-1"
              >
                Reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Approve Confirmation Dialog */}
        <AlertDialog
          open={showApproveDialog}
          onOpenChange={setShowApproveDialog}
        >
          <AlertDialogContent className="border-success/30">
            <AlertDialogHeader>
              <div className="mx-auto mb-2 w-20 h-20 rounded-full bg-success/20 flex items-center justify-center border-2 border-success/30 relative">
                <div className="absolute inset-0 rounded-full bg-success/5 animate-ping"></div>
                <Sparkles
                  className="w-10 h-10 text-success relative z-10"
                  strokeWidth={2.5}
                />
              </div>
              <AlertDialogTitle className="text-foreground">
                Advance {candidate?.name}?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Move candidate to the next round and send notification email.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleMoveToNextLevel}
                className="bg-success hover:bg-success/90 text-white flex-1 transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Advance
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
};

export default CandidateDetail;
