import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    console.error('Please set MONGODB_URI in your .env file');
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
}

let isConnecting = false;
let connectionPromise: Promise<void> | null = null;

// Set up connection event handlers once
let handlersSetup = false;

const setupConnectionHandlers = () => {
    if (handlersSetup) return;
    handlersSetup = true;

    mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
        isConnecting = false;
        connectionPromise = null;
    });

    mongoose.connection.on('disconnected', () => {
        // Only log if not in production to reduce noise
        if (process.env.NODE_ENV !== 'production') {
            console.warn('⚠️ MongoDB disconnected - will reconnect on next use');
        }
        isConnecting = false;
        connectionPromise = null;
    });

    mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
    });
};

// Track if we've logged initial connection
let hasLoggedConnection = false;

export const connectDB = async () => {
    // If already connected, return immediately (no logging, no operation)
    if (mongoose.connection.readyState === 1) {
        return;
    }

    // If currently connecting, wait for that connection
    if (mongoose.connection.readyState === 2) {
        if (connectionPromise) {
            return connectionPromise;
        }
        // Wait for connection to complete
        return new Promise<void>((resolve) => {
            mongoose.connection.once('connected', () => resolve());
            mongoose.connection.once('error', () => resolve());
        });
    }

    // If currently connecting via our promise, wait for it
    if (isConnecting && connectionPromise) {
        return connectionPromise;
    }

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not configured. Please set it in your .env file');
    }

    // Start connection process
    isConnecting = true;
    connectionPromise = (async () => {
        try {
            setupConnectionHandlers();
            
            // Only log on first connection attempt
            if (!hasLoggedConnection) {
                const redactedUri = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
                console.log(`🔌 Connecting to MongoDB...`);
                console.log(`   URI: ${redactedUri}`);
            }

            await mongoose.connect(MONGODB_URI, {
                maxPoolSize: 10,
                minPoolSize: 2,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                heartbeatFrequencyMS: 10000,
            });
            
            // Log success only once
            if (!hasLoggedConnection) {
                console.log('✅ Connected to MongoDB Atlas');
                hasLoggedConnection = true;
            }
            
            isConnecting = false;
        } catch (error: any) {
            console.error('❌ MongoDB connection error:', error.message);
            isConnecting = false;
            connectionPromise = null;
            if (process.env.NODE_ENV === 'production') {
                process.exit(1);
            }
            throw error;
        }
    })();

    return connectionPromise;
};

// Connection will be established on first use
// No need to connect at module load - let it connect when first needed
