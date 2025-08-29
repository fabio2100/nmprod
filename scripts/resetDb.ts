import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

async function resetCollection() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('Please define the MONGODB_URI environment variable inside .env');
        }

        await mongoose.connect(MONGODB_URI);
        await mongoose.connection.collection('users').drop();
        console.log('Collection users has been reset successfully');
    } catch (error) {
        console.error('Error resetting collection:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetCollection();
