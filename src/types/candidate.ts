export type CandidateStatus = "pending" | "in-progress" | "completed" | "expired" | "failed";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: CandidateStatus;
  interviewLink: string;
  linkExpiry: Date;
  emailSentAt?: Date;
  interviewCompletedAt?: Date;
  transcript?: string;
  summary?: string;
  score?: number;
}
