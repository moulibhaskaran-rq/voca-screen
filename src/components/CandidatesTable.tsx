import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCw, Eye } from "lucide-react";
import { Candidate, CandidateStatus } from "@/types/candidate";
import { formatDistanceToNow } from "date-fns";

interface CandidatesTableProps {
  candidates: Candidate[];
  onCandidateClick: (candidate: Candidate) => void;
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

export const CandidatesTable = ({ candidates, onCandidateClick, onResendEmail }: CandidatesTableProps) => {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Candidates</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and track all candidate interviews
        </p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Email Sent</TableHead>
            <TableHead>Link Expiry</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">{candidate.name}</TableCell>
              <TableCell>{candidate.position}</TableCell>
              <TableCell className="text-muted-foreground">{candidate.email}</TableCell>
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
                      onCandidateClick(candidate);
                    }}
                    className="gap-1"
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
                      className="gap-1"
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
