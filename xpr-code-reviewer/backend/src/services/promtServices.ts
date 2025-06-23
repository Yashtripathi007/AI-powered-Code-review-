export interface PromptOptions {
  code: string;
  language?: string;
  customInstructions?: string;
}

export class PromptService {
  static buildReviewPrompt({ code, language = 'javascript', customInstructions }: PromptOptions): string {
    const basePrompt = `
Please review the following ${language} code and provide feedback in a structured format.

Focus on:
1. Code correctness and potential bugs
2. Performance optimizations
3. Best practices and coding standards
4. Security considerations
${customInstructions ? `5. ${customInstructions}` : ''}

Please format your response as follows:
**STRENGTHS:**
- [List positive aspects]

**ISSUES:**
- [List problems or concerns]

**SUGGESTIONS:**
- [List specific improvements]

Code to review:
\`\`\`${language}
${code}
\`\`\`
`;

    return basePrompt.trim();
  }
}