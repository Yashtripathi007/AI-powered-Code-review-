import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('🔌 Attempting MongoDB connection...');
    console.log('MongoDB URI exists:', !!mongoUri);
    console.log('MongoDB URI (masked):', mongoUri ? mongoUri.replace(/\/\/.*@/, '//***:***@') : 'Not provided');

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    // Enhanced connection options
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
    });

    console.log('✅ MongoDB connected successfully');
    console.log('Database name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);

    // Add connection event listeners
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    process.exit(1);
  }
};