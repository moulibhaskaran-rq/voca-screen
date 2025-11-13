import { useState } from "react";
import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { CandidatesTable } from "@/components/CandidatesTable";
import { UploadDialog } from "@/components/UploadDialog";
import { CandidateDetailDialog } from "@/components/CandidateDetailDialog";
import { Candidate } from "@/types/candidate";

const Index = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Mock data - in production, this would come from your backend
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 123-4567",
      position: "Senior Frontend Developer",
      status: "completed",
      interviewLink: "https://interview.ai/abc123",
      linkExpiry: new Date(Date.now() + 86400000),
      emailSentAt: new Date(Date.now() - 3600000),
      interviewCompletedAt: new Date(Date.now() - 1800000),
      transcript: "AI: Hello Sarah, thank you for joining us today. Let's start with your experience...",
      summary: "Strong technical background with 6+ years in React. Excellent communication skills. Shows deep understanding of modern frontend architecture.",
      score: 8.5,
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "+1 (555) 234-5678",
      position: "Backend Engineer",
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

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleResendEmail = (candidateId: string) => {
    console.log("Resending email to candidate:", candidateId);
    // Implementation would trigger email resend
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onUploadClick={() => setUploadDialogOpen(true)} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AI Recruitment Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track and manage candidate screening interviews
          </p>
        </div>

        <StatsCards stats={stats} />

        <div className="mt-8">
          <CandidatesTable
            candidates={candidates}
            onCandidateClick={handleCandidateClick}
            onResendEmail={handleResendEmail}
          />
        </div>
      </main>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />

      <CandidateDetailDialog
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
};

export default Index;
