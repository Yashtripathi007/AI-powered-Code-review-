import React from 'react';
import type { ReviewResponse } from '../types';

interface ReviewResultsProps {
  result: ReviewResponse;
}

export const ReviewResults: React.FC<ReviewResultsProps> = ({ result }) => {
  const renderList = (items: string[], title: string, emoji: string, color: string) => (
    <div style={{
      backgroundColor: '#f8f9fa',
      border: `2px solid ${color}`,
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '20px'
    }}>
      <h3 style={{ color, margin: '0 0 10px 0' }}>
        {emoji} {title}
      </h3>
      {items.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {items.map((item, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#6c757d', fontStyle: 'italic', margin: 0 }}>
          No {title.toLowerCase()} identified.
        </p>
      )}
    </div>
  );

  return (
    <div>
      <h2>📊 Code Review Results</h2>
      
      {renderList(result.strengths, 'Strengths', '✅', '#28a745')}
      {renderList(result.issues, 'Issues', '⚠️', '#ffc107')}
      {renderList(result.suggestions, 'Suggestions', '💡', '#17a2b8')}
      
      <div style={{
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#6c757d'
      }}>
        💡 <strong>Tip:</strong> Use these insights to improve your code quality and follow best practices!
      </div>
    </div>
  );
};