import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RotateCw,
  Eye,
  Award,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Candidate, CandidateStatus } from "@/types/candidate";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface PaginationInfo {
  limit: number;
  page: number;
  overallPages: number;
  overallCount: number;
  previousPage: number | null;
  currentPage: number;
  nextPage: number | null;
}

interface CandidatesTableProps {
  candidates: Candidate[];
  onResendEmail: (candidateId: string) => void;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

type SortField =
  | "name"
  | "position"
  | "seniorityLevel"
  | "status"
  | "emailSentAt"
  | "linkExpiry";
type SortDirection = "asc" | "desc" | null;

const getStatusBadge = (status: CandidateStatus) => {
  const variants: Record<
    CandidateStatus,
    {
      variant: "secondary" | "default" | "destructive";
      label: string;
      className?: string;
    }
  > = {
    pending: { variant: "secondary", label: "Pending" },
    "in-progress": { variant: "default", label: "In Progress" },
    completed: {
      variant: "default",
      label: "Completed",
      className:
        "bg-success text-success-foreground hover:bg-success/90 transition-colors",
    },
    expired: {
      variant: "destructive",
      label: "Expired",
      className: "hover:bg-destructive/90 transition-colors",
    },
    failed: {
      variant: "destructive",
      label: "Failed",
      className: "hover:bg-destructive/90 transition-colors",
    },
  };

  const config = variants[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export const CandidatesTable = ({
  candidates,
  onResendEmail,
  pagination,
  onPageChange,
  isLoading = false,
}: CandidatesTableProps) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);

  // Use API pagination if available, otherwise use client-side pagination
  const itemsPerPage = pagination?.limit || 10;
  const totalPages = pagination?.overallPages || Math.ceil(candidates.length / itemsPerPage);
  const totalCandidates = pagination?.overallCount || candidates.length;

  // Sorting logic
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 text-primary" />
    ) : (
      <ArrowDown className="w-4 h-4 text-primary" />
    );
  };

  // Sort candidates
  const sortedCandidates = [...candidates].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: string | number | Date = a[sortField];
    let bValue: string | number | Date = b[sortField];

    if (sortField === "emailSentAt" || sortField === "linkExpiry") {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCandidates = pagination
    ? candidates // Use candidates directly when using API pagination
    : sortedCandidates.slice(startIndex, endIndex); // Use client-side pagination otherwise

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);

    // Call API pagination callback if provided
    if (onPageChange && pagination) {
      onPageChange(newPage);
    }
  };

  const getSeniorityBadge = (level: string | undefined) => {
    if (!level) return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";

    const normalizedLevel = level.toLowerCase();
    const colors: Record<string, string> = {
      junior:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      "mid-senior": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      mid: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      senior:
        "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      lead: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
      executive:
        "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    };
    return colors[normalizedLevel] || colors.mid;
  };

  return (
    <div className="glass backdrop-blur-xl border-2 border-primary/30 overflow-hidden transition-all duration-300 animate-fade-in flex flex-col" style={{ borderRadius: "1.5rem" }}>
      <div className="p-6 border-b-2 border-white/10 bg-primary/5 backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Candidates
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-2">
              Manage and track all candidate interviews
            </p>
          </div>
          <div className="text-center glass rounded-2xl px-6 py-4 backdrop-blur-md border border-primary/20 hover:border-primary/40 transition-all duration-300">
            <p className="text-3xl font-bold text-foreground">
              {totalCandidates}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Total Candidates
            </p>
          </div>
        </div>
      </div>

      <Table className="flex-grow">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b-2 border-border/50">
            <TableHead
              className="font-bold text-foreground cursor-pointer select-none"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-1">
                Name
                {getSortIcon("name")}
              </div>
            </TableHead>
            <TableHead
              className="font-bold text-foreground cursor-pointer select-none"
              onClick={() => handleSort("position")}
            >
              <div className="flex items-center gap-2">
                Position
                {getSortIcon("position")}
              </div>
            </TableHead>
            <TableHead
              className="font-bold text-foreground cursor-pointer select-none"
              onClick={() => handleSort("seniorityLevel")}
            >
              <div className="flex items-center gap-2">
                Level
                {getSortIcon("seniorityLevel")}
              </div>
            </TableHead>
            <TableHead className="font-bold text-foreground">Email</TableHead>
            <TableHead
              className="font-bold text-foreground cursor-pointer select-none"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-2">
                Status
                {getSortIcon("status")}
              </div>
            </TableHead>
            <TableHead
              className="font-bold text-foreground cursor-pointer select-none"
              onClick={() => handleSort("linkExpiry")}
            >
              <div className="flex items-center gap-2">
                Link Expiry
                {getSortIcon("linkExpiry")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCandidates.map((candidate, index) => {
            // Generate dynamic color based on first letter
            const getInitialColor = (name: string) => {
              const colors = [
                { bg: "bg-blue-500/20", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30" },
                { bg: "bg-purple-500/20", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30" },
                { bg: "bg-green-500/20", text: "text-green-600 dark:text-green-400", border: "border-green-500/30" },
                { bg: "bg-orange-500/20", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/30" },
                { bg: "bg-pink-500/20", text: "text-pink-600 dark:text-pink-400", border: "border-pink-500/30" },
                { bg: "bg-cyan-500/20", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/30" },
                { bg: "bg-red-500/20", text: "text-red-600 dark:text-red-400", border: "border-red-500/30" },
                { bg: "bg-indigo-500/20", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/30" },
              ];
              const charCode = name.charCodeAt(0);
              return colors[charCode % colors.length];
            };

            const initialColor = getInitialColor(candidate.name);

            return (
              <TableRow
                key={candidate.id}
                onClick={() => navigate(`/candidate/${candidate.id}`)}
                className="cursor-pointer group border-b border-border/30 hover:bg-muted/60 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="font-semibold py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${initialColor.bg} flex items-center justify-center border ${initialColor.border}`}>
                      <span className={`text-xs font-bold ${initialColor.text}`}>
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
                  )} border text-xs font-semibold transition-all`}
                  variant="outline"
                >
                  <Award className="w-3 h-3 mr-1" />
                  {candidate.seniorityLevel
                    ? candidate.seniorityLevel.charAt(0).toUpperCase() +
                      candidate.seniorityLevel.slice(1)
                    : "N/A"}
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
                <span
                  className={
                    candidate.linkExpiry < new Date()
                      ? "text-destructive font-semibold"
                      : ""
                  }
                >
                  {formatDistanceToNow(candidate.linkExpiry, {
                    addSuffix: true,
                  })}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 justify-start">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/candidate/${candidate.id}`);
                    }}
                    className="gap-1 hover:scale-105 transition-all duration-200 text-foreground hover:text-foreground bg-primary/20 hover:bg-primary border border-primary/30 hover:border-primary font-semibold cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  {(candidate.status === "expired" ||
                    candidate.status === "failed") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onResendEmail(candidate.id);
                      }}
                      className="gap-1 hover:scale-105 transition-all duration-200 text-foreground hover:text-foreground bg-warning/20 hover:bg-warning border border-warning/30 hover:border-warning font-semibold cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4" />
                      Resend
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
            );
          })
          }
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-6 border-t border-white/10 bg-primary/5">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, totalCandidates)} of{" "}
            {totalCandidates} candidates
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="gap-1 bg-primary/10 hover:bg-primary/20 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className={
                      currentPage === page
                        ? "bg-primary text-primary-foreground cursor-pointer"
                        : "border-white/20 hover:bg-primary/10 cursor-pointer"
                    }
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="gap-1 bg-primary/10 hover:bg-primary/20 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
