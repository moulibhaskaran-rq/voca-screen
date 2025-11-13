import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCw, Eye, Award } from "lucide-react";
import { Candidate, CandidateStatus } from "@/types/candidate";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface CandidatesTableProps {
  candidates: Candidate[];
  onResendEmail: (candidateId: string) => void;
}

const getStatusBadge = (status: CandidateStatus) => {
  const variants: Record<CandidateStatus, { variant: "secondary" | "default" | "destructive"; label: string; className?: string }> = {
    pending: { variant: "secondary", label: "Pending" },
    "in-progress": { variant: "default", label: "In Progress" },
    completed: { variant: "default", label: "Completed", className: "bg-success text-success-foreground" },
    expired: { variant: "destructive", label: "Expired" },
    failed: { variant: "destructive", label: "Failed" },
  };

  const config = variants[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export const CandidatesTable = ({ candidates, onResendEmail }: CandidatesTableProps) => {
  const navigate = useNavigate();

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

  return (
    <div className="bg-card rounded-lg border-2 border-border overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="p-6 border-b border-border bg-gradient-to-r from-background to-muted/20">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          Candidates
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and track all candidate interviews
        </p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Position</TableHead>
            <TableHead className="font-semibold">Level</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Email Sent</TableHead>
            <TableHead className="font-semibold">Link Expiry</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate, index) => (
            <TableRow 
              key={candidate.id} 
              className="cursor-pointer hover:bg-muted/50 transition-all duration-200 group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-medium group-hover:text-primary transition-colors">
                {candidate.name}
              </TableCell>
              <TableCell className="text-muted-foreground">{candidate.position}</TableCell>
              <TableCell>
                <Badge 
                  className={`${getSeniorityBadge(candidate.seniorityLevel)} border text-xs`}
                  variant="outline"
                >
                  <Award className="w-3 h-3 mr-1" />
                  {candidate.seniorityLevel.charAt(0).toUpperCase() + candidate.seniorityLevel.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{candidate.email}</TableCell>
              <TableCell>{getStatusBadge(candidate.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {candidate.emailSentAt
                  ? formatDistanceToNow(candidate.emailSentAt, { addSuffix: true })
                  : "-"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(candidate.linkExpiry, { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/candidate/${candidate.id}`);
                    }}
                    className="gap-1 hover:scale-105 transition-transform hover:text-primary"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  {(candidate.status === "expired" || candidate.status === "failed") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onResendEmail(candidate.id);
                      }}
                      className="gap-1 hover:scale-105 transition-transform"
                    >
                      <RotateCw className="w-4 h-4" />
                      Resend
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
