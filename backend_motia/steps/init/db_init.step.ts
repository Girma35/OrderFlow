import { connectDB } from '../../database/connection';
import type { EventConfig } from 'motia';

// This step runs once at startup to initialize database connection
export const config: EventConfig = {
  name: 'dbInitStep',
  type: 'event',
  description: 'Initializes database connection at startup',
  subscribes: ['app.startup', 'system.ready'],
  emits: [],
  flows: []
};

export const handler = async (input: any, { logger }: any) => {
  try {
    logger.info('Initializing database connection...');
    await connectDB();
    logger.info('✅ Database connection initialized successfully');
    return { status: 'connected' };
  } catch (error: any) {
    logger.error('❌ Failed to initialize database connection', { error: error.message });
    throw error;
  }
};

