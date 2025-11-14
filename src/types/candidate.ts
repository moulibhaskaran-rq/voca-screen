export type CandidateStatus = "pending" | "in-progress" | "completed" | "expired" | "failed";
export type SeniorityLevel = "junior" | "mid-senior" | "senior";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  seniorityLevel: SeniorityLevel;
  status: CandidateStatus;
  interviewLink: string;
  linkExpiry: Date;
  expiresIn?: string;
  emailSentAt?: Date;
  interviewCompletedAt?: Date;
  transcript?: string;
  summary?: string;
  score?: number;
}
