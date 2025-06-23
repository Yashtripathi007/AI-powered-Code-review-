import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export class ChatGPTService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('OPENAI_API_KEY environment variable is not set or is empty');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async getCodeReview(prompt: string): Promise<string> {
    try {
      // Validate input
      if (!prompt || prompt.trim() === '') {
        throw new Error('Prompt cannot be empty');
      }

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo", // More reliable and cost-effective
        messages: [
          {
            role: "system",
            content: "You are an expert code reviewer. Provide detailed, constructive feedback on code quality, best practices, and potential improvements."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      });

      return completion.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      // Provide more specific error information
      if (error instanceof Error) {
        // Check for specific OpenAI error types
        if ('status' in error) {
          const apiError = error as any;
          switch (apiError.status) {
            case 401:
              throw new Error('Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.');
            case 429:
              throw new Error('OpenAI API rate limit exceeded. Please try again later.');
            case 500:
              throw new Error('OpenAI API server error. Please try again later.');
            case 503:
              throw new Error('OpenAI API service unavailable. Please try again later.');
            default:
              throw new Error(`OpenAI API error (${apiError.status}): ${apiError.message || 'Unknown error'}`);
          }
        }
        throw new Error(`Failed to get code review: ${error.message}`);
      }
      
      throw new Error('Failed to get code review from OpenAI: Unknown error');
    }
  }
}