import axios from 'axios';
import type { ReviewResponse, ReviewSession, ApiResponse } from '../types';


const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  async submitCodeReview(
    code: string,
    language: string = 'javascript',
    customInstructions?: string
  ): Promise<ReviewResponse> {
    try {
      const payload: any = { code, language };
      if (customInstructions) payload.customInstructions = customInstructions;

      const response = await api.post<ApiResponse<{ response: ReviewResponse }>>(
        '/review',
        payload
      );
      return response.data.data.response;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Failed to submit code review'
      );
    }
  },

  async getReviewHistory(): Promise<ReviewSession[]> {
    try {
      const response = await api.get<ApiResponse<ReviewSession[]>>('/reviews');
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || 'Failed to fetch review history'
      );
    }
  }
};