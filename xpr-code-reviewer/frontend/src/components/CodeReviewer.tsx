import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import type { ReviewResponse } from '../types';
import { ReviewResults } from './ReviewResults'; // ✅ Proper import for component

export const CodeReviewer: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError('Please enter some code to review');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiService.submitCodeReview(code, language, customInstructions);
      setReviewResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to submit code review');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCode('');
    setCustomInstructions('');
    setReviewResult(null);
    setError(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', width: '100vh' }}>
      <h1>🧩 AI Code Reviewer</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            <strong>Programming Language:</strong>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="typescript">TypeScript</option>
              <option value="cpp">C++</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <strong>Code to Review:</strong>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              rows={15}
              style={{
                width: '100%',
                fontFamily: 'monospace',
                fontSize: '14px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginTop: '5px'
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <strong>Custom Instructions (Optional):</strong>
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g., focus on security issues, performance optimization..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginTop: '5px'
              }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? '🔄 Reviewing...' : '🚀 Submit for Review'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Reset
          </button>
        </div>
      </form>

      {error && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '20px'
          }}
        >
          ❌ {error}
        </div>
      )}

      {reviewResult && <ReviewResults result={reviewResult} />}
    </div>
  );
};
