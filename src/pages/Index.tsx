import { useState } from "react";
import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { CandidatesTable } from "@/components/CandidatesTable";
import { UploadDialog } from "@/components/UploadDialog";
import { Candidate } from "@/types/candidate";

const Index = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

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
    console.log("Resending email to candidate:", candidateId);
    // Implementation would trigger email resend
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onUploadClick={() => setUploadDialogOpen(true)} />

      <main className="container mx-auto px-6 py-12 animate-fade-in">
        {/* Header Section */}
        <div className="mb-16 animate-slide-in-from-top space-y-6">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold mb-4 text-foreground leading-tight">
              AI Recruitment Dashboard
            </h1>
            <p className="text-muted-foreground/90 text-lg md:text-xl max-w-3xl font-light leading-relaxed">
              Track and manage candidate screening interviews with AI-powered insights. Streamline your recruitment process with intelligent automation.
            </p>
          </div>

          {/* Quick Stats Row - Glassy */}
          <div className="flex flex-wrap gap-4 pt-6">
            <div className="glass backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 animate-bounce-in hover:shadow-glass-sm transition-all duration-300">
              <p className="text-sm font-semibold text-primary">
                ✨ AI-Powered Screening
              </p>
            </div>
            <div className="glass backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 animate-bounce-in hover:shadow-glass-sm transition-all duration-300" style={{ animationDelay: "100ms" }}>
              <p className="text-sm font-semibold text-success">
                🚀 {stats.completed} Completed Interviews
              </p>
            </div>
            <div className="glass backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 animate-bounce-in hover:shadow-glass-sm transition-all duration-300" style={{ animationDelay: "200ms" }}>
              <p className="text-sm font-semibold text-warning">
                ⏳ {stats.inProgress} In Progress
              </p>
            </div>
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
    </div>
  );
};

export default Index;
