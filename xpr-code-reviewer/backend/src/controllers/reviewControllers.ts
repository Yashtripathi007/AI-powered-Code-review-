import { Request, Response } from 'express';
import { PromptService } from '../services/promtServices';
import { ChatGPTService } from '../services/chatGptservices';
import { ParseService } from '../services/parseService';
import { ReviewSession } from '../models/reviewSession';

export class ReviewController {
  private chatGPTService: ChatGPTService;

  constructor() {
    this.chatGPTService = new ChatGPTService();
  }

  async submitReview(req: Request, res: Response): Promise<void> {
    try {
      console.log('📝 Review submission started');
      console.log('Request body:', JSON.stringify(req.body, null, 2));

      const { code, language, customInstructions } = req.body;

      if (!code || code.trim().length === 0) {
        console.log('❌ Validation failed: Code is required');
        res.status(400).json({ error: 'Code is required' });
        return;
      }

      console.log('✅ Validation passed');

      // Build prompt
      console.log('🔨 Building prompt...');
      const prompt = PromptService.buildReviewPrompt({
        code,
        language,
        customInstructions
      });
      console.log('Prompt created, length:', prompt.length);

      // Get ChatGPT response
      console.log('🤖 Getting ChatGPT response...');
      const gptResponse = await this.chatGPTService.getCodeReview(prompt);
      console.log('GPT Response received, length:', gptResponse.length);

      // Parse response
      console.log('📊 Parsing GPT response...');
      const parsedResponse = ParseService.parseGPTResponse(gptResponse);
      console.log('Parsed response:', JSON.stringify(parsedResponse, null, 2));

      // Save to MongoDB - ENHANCED LOGGING
      console.log('💾 Attempting to save to MongoDB...');
      console.log('MongoDB connection state:', require('mongoose').connection.readyState);
      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

      const reviewSessionData = {
        code,
        prompt,
        response: parsedResponse,
        language: language || 'javascript',
        customInstructions
      };

      console.log('Review session data to save:', JSON.stringify(reviewSessionData, null, 2));

      const reviewSession = new ReviewSession(reviewSessionData);
      console.log('Review session model created');

      // Add pre-save logging
    
      const savedSession = await reviewSession.save();
      console.log('✅ Successfully saved to MongoDB!');
      console.log('Saved document ID:', savedSession._id);
      console.log('Saved document:', JSON.stringify(savedSession.toObject(), null, 2));

      // Verify the save by querying back
      const verifyQuery = await ReviewSession.findById(savedSession._id);
      console.log('🔍 Verification query result:', verifyQuery ? 'FOUND' : 'NOT FOUND');

      res.json({
        success: true,
        data: {
          sessionId: savedSession._id,
          response: parsedResponse,
          createdAt: savedSession.createdAt
        }
      });

    } catch (error) {
      console.error('❌ Review submission error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      res.status(500).json({ 
        error: 'Failed to process code review',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  async getReviewHistory(req: Request, res: Response): Promise<void> {
    try {
      console.log('📚 Fetching review history...');
      console.log('MongoDB connection state:', require('mongoose').connection.readyState);

      const reviews = await ReviewSession.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('_id code language response.strengths response.issues response.suggestions createdAt');

      console.log('Found reviews count:', reviews.length);
      console.log('Reviews:', JSON.stringify(reviews, null, 2));

      res.json({
        success: true,
        data: reviews
      });
    } catch (error) {
      console.error('❌ Error fetching review history:', error);
      res.status(500).json({ error: 'Failed to fetch review history' });
    }
  }

  // Add a test endpoint to check MongoDB connection
  async testConnection(req: Request, res: Response): Promise<void> {
    try {
      const mongoose = require('mongoose');
      const connectionState = mongoose.connection.readyState;
      const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
      
      console.log('🔌 MongoDB Connection Test');
      console.log('Connection state:', states[connectionState]);
      console.log('Database name:', mongoose.connection.name);
      console.log('Host:', mongoose.connection.host);
      console.log('Port:', mongoose.connection.port);

      // Try to count documents
      const count = await ReviewSession.countDocuments();
      console.log('Current document count in ReviewSession collection:', count);

      // Try to insert a test document
      const testDoc = new ReviewSession({
        code: 'console.log("test");',
        prompt: 'test prompt',
        response: {
          strengths: ['test strength'],
          issues: ['test issue'],
          suggestions: ['test suggestion']
        },
        language: 'javascript',
        customInstructions: 'test'
      });

      const saved = await testDoc.save();
      console.log('✅ Test document saved with ID:', saved._id);

      // Clean up test document
      await ReviewSession.findByIdAndDelete(saved._id);
      console.log('🗑️ Test document cleaned up');

      res.json({
        success: true,
        connectionState: states[connectionState],
        databaseName: mongoose.connection.name,
        documentCount: count,
        testResult: 'MongoDB is working correctly'
      });

    } catch (error) {
      console.error('❌ MongoDB connection test failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      });
    }
  }
}