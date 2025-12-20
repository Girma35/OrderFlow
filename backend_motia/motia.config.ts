import { defineConfig } from '@motiadev/core'
import endpointPlugin from '@motiadev/plugin-endpoint/plugin'
import logsPlugin from '@motiadev/plugin-logs/plugin'
// Disabled observability plugin due to date-fns dependency issues
// import observabilityPlugin from '@motiadev/plugin-observability/plugin'
import statesPlugin from '@motiadev/plugin-states/plugin'
import bullmqPlugin from '@motiadev/plugin-bullmq/plugin'
import { connectDB } from './database/connection'

// Handle unhandled Redis connection errors gracefully
process.on('unhandledRejection', (reason: any, promise) => {
  // Check if it's a Redis connection error
  if (reason?.code === 'ECONNRESET' || reason?.message?.includes('ECONNRESET')) {
    console.warn('⚠️ Redis connection reset - will reconnect automatically');
    return; // Don't crash, Redis will auto-reconnect
  }
  
  // Log other unhandled rejections but don't crash in dev
  if (process.env.NODE_ENV !== 'production') {
    console.error('Unhandled Rejection:', reason);
  }
});

process.on('uncaughtException', (error: Error) => {
  // Check if it's a Redis connection error
  if (error.message?.includes('ECONNRESET') || error.code === 'ECONNRESET') {
    console.warn('⚠️ Redis connection error caught - continuing operation');
    return; // Don't crash
  }
  
  console.error('Uncaught Exception:', error);
  // In production, you might want to exit, but in dev we continue
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

export default defineConfig({
  // Removed observabilityPlugin to fix date-fns build errors
  plugins: [statesPlugin, endpointPlugin, logsPlugin, bullmqPlugin],
  
  // Configure Redis with error handling
  redis: {
    useMemoryServer: true,
  },
  
  // Ensure DB connection on startup
  app: (app) => {
    // Ensure DB connection is established when the Express app starts
    connectDB().catch(err => {
      console.error('Failed to connect to MongoDB on app startup:', err);
      // In a real application, you might want to gracefully shut down or retry
    });
    
    // Add error handling middleware for unhandled errors
    app.use((err: any, req: any, res: any, next: any) => {
      console.error('Express error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  }
})
