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
    <div className="glass backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-glass-lg transition-all duration-300 animate-fade-in hover:shadow-glass-xl">
      <div className="p-8 border-b border-white/10 bg-gradient-to-r from-primary/5 via-transparent to-success/5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary/30 to-primary-glow/20 rounded-2xl shadow-glow-md">
                <Award className="w-6 h-6 text-primary" />
              </div>
              Candidates
            </h2>
            <p className="text-sm text-muted-foreground/80 mt-2">
              Manage and track all candidate interviews
            </p>
          </div>
          <div className="text-right glass rounded-2xl px-6 py-4 backdrop-blur-md border border-white/10">
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">{candidates.length}</p>
            <p className="text-xs text-muted-foreground">Total Candidates</p>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b-2 border-border/50">
            <TableHead className="font-bold text-foreground">Name</TableHead>
            <TableHead className="font-bold text-foreground">Position</TableHead>
            <TableHead className="font-bold text-foreground">Level</TableHead>
            <TableHead className="font-bold text-foreground">Email</TableHead>
            <TableHead className="font-bold text-foreground">Status</TableHead>
            <TableHead className="font-bold text-foreground">Email Sent</TableHead>
            <TableHead className="font-bold text-foreground">Link Expiry</TableHead>
            <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate, index) => (
            <TableRow
              key={candidate.id}
              className="cursor-pointer group border-b border-border/30 hover:bg-muted/60 transition-all duration-300 animate-fade-in hover:shadow-glow-sm"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-semibold group-hover:text-primary transition-colors py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {candidate.name.charAt(0)}
                    </span>
                  </div>
                  {candidate.name}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors">
                {candidate.position}
              </TableCell>
              <TableCell>
                <Badge
                  className={`${getSeniorityBadge(
                    candidate.seniorityLevel
                  )} border text-xs font-semibold group-hover:shadow-glow-sm transition-all`}
                  variant="outline"
                >
                  <Award className="w-3 h-3 mr-1" />
                  {candidate.seniorityLevel.charAt(0).toUpperCase() +
                    candidate.seniorityLevel.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                {candidate.email}
              </TableCell>
              <TableCell>
                <div className="inline-flex items-center gap-1 group/status">
                  {getStatusBadge(candidate.status)}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {candidate.emailSentAt
                  ? formatDistanceToNow(candidate.emailSentAt, { addSuffix: true })
                  : "-"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                <span className={candidate.linkExpiry < new Date() ? "text-destructive font-semibold" : ""}>
                  {formatDistanceToNow(candidate.linkExpiry, { addSuffix: true })}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/candidate/${candidate.id}`);
                    }}
                    className="gap-1 hover:scale-110 hover:shadow-glow-md transition-all duration-200 hover:text-primary bg-primary/10 hover:bg-primary/20"
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
                      className="gap-1 hover:scale-110 hover:shadow-glow-md transition-all duration-200 hover:text-warning bg-warning/10 hover:bg-warning/20"
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
