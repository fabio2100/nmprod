import mongoose from 'mongoose';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const MONGODB_URI = process.env.MONGODB_URI;

interface GlobalMongo {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongooseGlobal: GlobalMongo | undefined;
}

let cached = global.mongooseGlobal;

if (!cached) {
    cached = global.mongooseGlobal = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached?.conn) {
        return cached.conn;
    }

    if (!cached?.promise) {
        const opts = {
            bufferCommands: true,
        };

        cached!.promise = mongoose.connect(MONGODB_URI, opts);
    }

    try {
        const conn = await cached!.promise;
        cached!.conn = conn;
    } catch (e) {
        cached!.promise = null;
        throw e;
    }

    return cached!.conn;
}

export default dbConnect;
