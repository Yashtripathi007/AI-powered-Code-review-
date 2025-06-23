import mongoose, { Document, Schema } from 'mongoose';

export interface IReviewSession extends Document {
  code: string;
  prompt: string;
  response: {
    strengths: string[];
    issues: string[];
    suggestions: string[];
  };
  language?: string;
  customInstructions?: string;
  createdAt: Date;
}

const reviewSessionSchema = new Schema<IReviewSession>({
  code: { type: String, required: true },
  prompt: { type: String, required: true },
  response: {
    strengths: [{ type: String }],
    issues: [{ type: String }],
    suggestions: [{ type: String }]
  },
  language: { type: String, default: 'javascript' },
  customInstructions: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const ReviewSession = mongoose.model<IReviewSession>('ReviewSession', reviewSessionSchema);