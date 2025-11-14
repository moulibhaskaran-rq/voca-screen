import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { CandidatesTable } from "@/components/CandidatesTable";
import { UploadDialog } from "@/components/UploadDialog";
import { Candidate } from "@/types/candidate";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { getCandidates } from "@/services/candidate";
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
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch candidates from API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        const response = await getCandidates();

        // Map API response to Candidate type
        const mappedCandidates: Candidate[] = response.data.prospects.map((prospect) => ({
          id: prospect.id || prospect._id,
          name: prospect.fullName,
          email: prospect.email,
          phone: prospect.contactNumber,
          position: prospect.position,
          seniorityLevel: prospect.seniorityLevel,
          status: "pending",
          interviewLink: "",
          linkExpiry: new Date(),
        }));

        setCandidates(mappedCandidates);
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
        toast.error("Failed to load candidates", {
          description: "Please try refreshing the page",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

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
        onCandidateAdded={() => {
          // Refresh candidates list
          const fetchCandidates = async () => {
            try {
              const response = await getCandidates();
              const mappedCandidates: Candidate[] = response.data.prospects.map((prospect) => ({
                id: prospect.id || prospect._id,
                name: prospect.fullName,
                email: prospect.email,
                phone: prospect.contactNumber,
                position: prospect.position,
                seniorityLevel: prospect.seniorityLevel,
                status: "pending",
                interviewLink: "",
                linkExpiry: new Date(),
              }));
              setCandidates(mappedCandidates);
            } catch (error) {
              console.error("Failed to refresh candidates:", error);
            }
          };
          fetchCandidates();
        }}
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
