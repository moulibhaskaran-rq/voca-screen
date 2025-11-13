import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Candidate } from "@/types/candidate";
import { Mail, Phone, Briefcase, Calendar, Link as LinkIcon, Star } from "lucide-react";
import { format } from "date-fns";

interface CandidateDetailDialogProps {
  candidate: Candidate | null;
  onClose: () => void;
}

export const CandidateDetailDialog = ({ candidate, onClose }: CandidateDetailDialogProps) => {
  if (!candidate) return null;

  return (
    <Dialog open={!!candidate} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{candidate.name}</DialogTitle>
              <p className="text-muted-foreground mt-1">{candidate.position}</p>
            </div>
            {candidate.score && (
              <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-semibold text-primary">{candidate.score}/10</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{candidate.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{candidate.position}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">
                Expires: {format(candidate.linkExpiry, "MMM d, yyyy")}
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Interview Link</h3>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-muted-foreground" />
              <code className="flex-1 text-xs bg-muted px-3 py-2 rounded">
                {candidate.interviewLink}
              </code>
              <Button size="sm" variant="outline">Copy</Button>
            </div>
          </div>

          {candidate.summary && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">AI Summary</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {candidate.summary}
                  </p>
                </div>
              </div>
            </>
          )}

          {candidate.transcript && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Interview Transcript</h3>
                <div className="bg-muted/50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono">
                    {candidate.transcript}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button>Download Report</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
