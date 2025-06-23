export interface ReviewResponse {
  strengths: string[];
  issues: string[];
  suggestions: string[];
}

export interface ReviewSession {
  _id: string;
  code: string;
  language: string;
  response: ReviewResponse;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}