import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. A real app should use a dedicated connection pool.
 */
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

const cached: MongooseCache = (global as { mongoose?: MongooseCache }).mongoose || { conn: null, promise: null };

// Ensure global cache persists across modules
if (typeof window === 'undefined') {
    (global as { mongoose?: MongooseCache }).mongoose = cached;
}

// Type guard/helper for the selection error reason (avoids 'any')
interface SelectionErrorReason {
    reason: {
        servers: Array<{ address: string; type: string; error?: Error }>;
    };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 90000,  // 60s timeout for discovering Atlas replica set nodes (default 30s often fails)
            socketTimeoutMS: 45000,           // 45s for socket operations
            family: 4,                        // Force IPv4 (avoids IPv6 resolution issues)
            // ssl: true,                      // Already implied in Atlas URIs, but explicit if needed
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log('✅ MongoDB connected successfully');
            return mongoose;
        }).catch((error) => {
            console.error('❌ Full MongoDB connection error:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                // For selection errors, this reveals node statuses
                ...(error as SelectionErrorReason).reason ? { topology: (error as SelectionErrorReason).reason.servers } : {}
            });
            throw error;  // Re-throw for your app to handle
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;