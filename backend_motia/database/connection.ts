import mongoose from 'mongoose';

const HARDCODED_URI = 'mongodb+srv://admin:0sctE9JFgO1oQG5x@cluster0.cqje20w.mongodb.net/orderflow?retryWrites=true&w=majority';
const MONGODB_URI = process.env.MONGODB_URI || HARDCODED_URI;

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        // Already connected, do not log or reconnect
        return;
    }

    try {
        const source = process.env.MONGODB_URI ? 'Environment Variable' : 'Hardcoded String';
        const redactedUri = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
        console.log(`🔌 Attempting MongoDB connection via ${source}...`);

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');
    } catch (error: any) {
        console.error('❌ MongoDB connection error:', error.message);
        // Don't exit process in dev mode to allow for hot-fix
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};
