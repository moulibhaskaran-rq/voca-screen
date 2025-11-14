import { useState } from "react";
import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { CandidatesTable } from "@/components/CandidatesTable";
import { UploadDialog } from "@/components/UploadDialog";
import { Candidate } from "@/types/candidate";
import { Mail } from "lucide-react";
import { toast } from "sonner";
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

const Index = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [showResendDialog, setShowResendDialog] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );

  // Mock data - in production, this would come from your backend
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "1",
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
        "AI: Hello Sarah, thank you for joining us today. Let's start with your experience...",
      summary:
        "Strong technical background with 6+ years in React. Excellent communication skills. Shows deep understanding of modern frontend architecture.",
      score: 8.5,
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "+1 (555) 234-5678",
      position: "Backend Engineer",
      seniorityLevel: "mid",
      status: "in-progress",
      interviewLink: "https://interview.ai/def456",
      linkExpiry: new Date(Date.now() + 172800000),
      emailSentAt: new Date(Date.now() - 7200000),
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "+1 (555) 345-6789",
      position: "Product Manager",
      seniorityLevel: "lead",
      status: "pending",
      interviewLink: "https://interview.ai/ghi789",
      linkExpiry: new Date(Date.now() + 259200000),
      emailSentAt: new Date(Date.now() - 300000),
    },
    {
      id: "4",
      name: "James Wilson",
      email: "j.wilson@email.com",
      phone: "+1 (555) 456-7890",
      position: "UX Designer",
      seniorityLevel: "senior",
      status: "expired",
      interviewLink: "https://interview.ai/jkl012",
      linkExpiry: new Date(Date.now() - 86400000),
      emailSentAt: new Date(Date.now() - 172800000),
    },
  ]);

  const stats = {
    total: candidates.length,
    completed: candidates.filter((c) => c.status === "completed").length,
    inProgress: candidates.filter((c) => c.status === "in-progress").length,
    pending: candidates.filter((c) => c.status === "pending").length,
  };

  const handleResendEmail = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setShowResendDialog(true);
  };

  const confirmResendEmail = () => {
    if (selectedCandidateId) {
      const candidate = candidates.find((c) => c.id === selectedCandidateId);
      toast.success("Interview Link Resent", {
        description: `Email sent to ${candidate?.name}`,
        duration: 3000,
        closeButton: true,
        icon: (
          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center border-2 border-warning/30">
            <Mail className="w-5 h-5 text-warning" strokeWidth={2.5} />
          </div>
        ),
      });
      setShowResendDialog(false);
      setSelectedCandidateId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onUploadClick={() => setUploadDialogOpen(true)} />

      <main className="container mx-auto px-6 py-12 animate-fade-in">
        {/* Header Section */}
        <div className="mb-16 animate-slide-in-from-top space-y-6">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold mb-4 leading-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl font-light leading-relaxed">
              Track and manage candidate screening interviews with{" "}
              <span className="text-foreground font-semibold">
                AI-powered insights
              </span>
              . Streamline your recruitment process with intelligent automation.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Candidates Table */}
        <div className="animate-slide-in-from-bottom">
          <CandidatesTable
            candidates={candidates}
            onResendEmail={handleResendEmail}
          />
        </div>
      </main>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />

      {/* Resend Email Confirmation Dialog */}
      <AlertDialog open={showResendDialog} onOpenChange={setShowResendDialog}>
        <AlertDialogContent className="border-warning/30">
          <AlertDialogHeader>
            <div className="mx-auto mb-2 w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center border-2 border-warning/30 relative">
              <div className="absolute inset-0 rounded-full bg-warning/5 animate-ping"></div>
              <Mail
                className="w-10 h-10 text-warning relative z-10"
                strokeWidth={2.5}
              />
            </div>
            <AlertDialogTitle className="text-foreground">
              Resend Interview Link?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              {selectedCandidateId &&
                `This will send a new interview link to ${
                  candidates.find((c) => c.id === selectedCandidateId)?.name
                }.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResendEmail}
              className="bg-warning hover:bg-warning/90 text-white flex-1 transition-all"
            >
              <Mail className="w-4 h-4 mr-2" />
              Resend Link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
