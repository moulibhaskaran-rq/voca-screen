/**
 * API Client Configuration
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = "http://localhost:8081/api/v1";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchWithErrorHandling<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    // Parse response body
    const data = await response.json();

    // If response is not OK and we don't have data with error details, throw error
    if (!response.ok && !data) {
      throw new ApiError(response.status, `HTTP ${response.status}`);
    }

    // Return the data regardless of HTTP status
    // Let the caller handle success/failure logic based on the response body
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError(0, "Network error. Please check your connection.");
    }

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      throw new ApiError(500, "Invalid response from server");
    }

    throw new ApiError(500, "An unexpected error occurred");
  }
}

/**
 * GET request
 */
export const apiGet = <T>(endpoint: string): Promise<T> => {
  return fetchWithErrorHandling<T>(endpoint, {
    method: "GET",
  });
};

/**
 * POST request
 */
export const apiPost = <T>(endpoint: string, body: unknown): Promise<T> => {
  return fetchWithErrorHandling<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

/**
 * PUT request
 */
export const apiPut = <T>(endpoint: string, body: unknown): Promise<T> => {
  return fetchWithErrorHandling<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
};

/**
 * DELETE request
 */
export const apiDelete = <T>(endpoint: string): Promise<T> => {
  return fetchWithErrorHandling<T>(endpoint, {
    method: "DELETE",
  });
};

export { ApiError };
