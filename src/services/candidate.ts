/**
 * Candidate Service
 * Handles all candidate-related API calls
 */

import { apiPost, apiGet } from "./api";
import { Candidate, SeniorityLevel } from "@/types/candidate";

/**
 * Payload structure expected by the API
 */
interface AddCandidatePayload {
  candidate: {
    fullName: string;
    email: string;
    contactNumber: string;
    position: string;
    seniorityLevel: "Junior" | "Mid-Senior" | "Senior";
    resume?: string;
  };
}

/**
 * API Response structure for adding a candidate
 */
interface AddCandidateResponse {
  success: boolean;
  title?: string;
  description?: string;
  message?: string;
  data?: Candidate;
}

/**
 * Capitalize seniority level for API
 */
const capitalizeSeniorityLevel = (level: SeniorityLevel): "Junior" | "Mid-Senior" | "Senior" => {
  const capitalizedMap: Record<SeniorityLevel, "Junior" | "Mid-Senior" | "Senior"> = {
    "junior": "Junior",
    "mid-senior": "Mid-Senior",
    "senior": "Senior",
  };
  return capitalizedMap[level];
};

/**
 * Custom error class for API responses with metadata
 */
export class AddCandidateError extends Error {
  constructor(public apiMessage: string, message?: string) {
    super(message || apiMessage);
    this.name = "AddCandidateError";
  }
}

/**
 * Add a new candidate to the system
 * Maps form data to the API's expected payload structure
 */
export const addCandidate = async (
  fullName: string,
  email: string,
  contactNumber: string,
  position: string,
  seniorityLevel: SeniorityLevel,
  resume?: string
): Promise<(Partial<Candidate> & { apiMessage: string })> => {
  const payload: AddCandidatePayload = {
    candidate: {
      fullName,
      email,
      contactNumber,
      position,
      seniorityLevel: capitalizeSeniorityLevel(seniorityLevel),
      ...(resume && { resume }),
    },
  };

  const response = await apiPost<AddCandidateResponse>(
    "/candidates",
    payload
  );

  // Check if request was successful
  if (response?.success === true) {
    // Extract API message for success
    const apiMessage = response?.title || response?.message || "Candidate added";

    // API returned success, create a candidate object from the form data
    return {
      id: response?.data?.id || "",
      name: fullName,
      email,
      phone: contactNumber,
      position,
      seniorityLevel: seniorityLevel as SeniorityLevel,
      status: response?.data?.status || "pending",
      interviewLink: response?.data?.interviewLink || "",
      linkExpiry: response?.data?.linkExpiry || new Date(),
      apiMessage,
    };
  }

  // If success is explicitly false, throw error with API message
  if (response?.success === false) {
    // Try to get error message from description, error, message fields
    const errorMessage = response?.description || response?.error || response?.message || "Failed to add candidate";
    throw new AddCandidateError(errorMessage, errorMessage);
  }

  // If we get here, something unexpected happened
  throw new AddCandidateError("Invalid response from server");
};

/**
 * Get all candidates
 */
interface CandidatesListResponse {
  success: boolean;
  title?: string;
  description?: string;
  data: {
    prospects: Array<{
      _id: string;
      fullName: string;
      position: string;
      seniorityLevel: SeniorityLevel;
      email: string;
      firstName: string;
      lastName: string;
      contactNumber: string;
      countryCode: string;
      id: string;
      attachmentId: string | null;
      followUpDate: string | null;
      profilePictureUrl: string | null;
      expiresIn?: string;
      status?: string;
    }>;
    pagination: {
      limit: number;
      page: number;
      overallPages: number;
      overallCount: number;
      previousPage: number | null;
      currentPage: number;
      nextPage: number | null;
    };
  };
}

export const getCandidates = async (page: number = 1): Promise<CandidatesListResponse> => {
  const response = await apiGet<CandidatesListResponse>(`/candidates?page=${page}&limit=6`);
  return response;
};

/**
 * Get a single candidate by ID
 */
export const getCandidate = async (id: string): Promise<Candidate> => {
  interface CandidateResponse {
    success: boolean;
    data: Candidate;
  }

  const response = await apiPost<CandidateResponse>(
    `/candidates/${id}`,
    {}
  );
  return response.data;
};
