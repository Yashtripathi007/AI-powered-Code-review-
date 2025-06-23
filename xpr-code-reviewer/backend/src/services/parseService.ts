export interface ParsedReview {
  strengths: string[];
  issues: string[];
  suggestions: string[];
}

export class ParseService {
  static parseGPTResponse(response: string): ParsedReview {
    const result: ParsedReview = {
      strengths: [],
      issues: [],
      suggestions: []
    };

    try {
      // Extract sections using regex
      const strengthsMatch = response.match(/\*\*STRENGTHS:\*\*(.*?)(?=\*\*ISSUES:\*\*|\*\*SUGGESTIONS:\*\*|$)/s);
      const issuesMatch = response.match(/\*\*ISSUES:\*\*(.*?)(?=\*\*STRENGTHS:\*\*|\*\*SUGGESTIONS:\*\*|$)/s);
      const suggestionsMatch = response.match(/\*\*SUGGESTIONS:\*\*(.*?)(?=\*\*STRENGTHS:\*\*|\*\*ISSUES:\*\*|$)/s);

      // Parse strengths
      if (strengthsMatch) {
        result.strengths = this.extractListItems(strengthsMatch[1]);
      }

      // Parse issues
      if (issuesMatch) {
        result.issues = this.extractListItems(issuesMatch[1]);
      }

      // Parse suggestions
      if (suggestionsMatch) {
        result.suggestions = this.extractListItems(suggestionsMatch[1]);
      }

      // Fallback: if structured parsing fails, try to extract any bullet points
      if (result.strengths.length === 0 && result.issues.length === 0 && result.suggestions.length === 0) {
        const allItems = this.extractListItems(response);
        // Distribute items across categories (simple heuristic)
        result.suggestions = allItems;
      }

    } catch (error) {
      console.error('Error parsing GPT response:', error);
    }

    return result;
  }

  private static extractListItems(text: string): string[] {
    const items = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, ''))
      .filter(line => line.length > 0);

    return items;
  }
}