import mongoose from "mongoose";

const connectionUrl = process.env.MONGODB_URI;

if (!connectionUrl) {
  throw new Error("Missing MONGODB_URI in environment variables");
}

const cachedConnection = globalThis.__mongooseConnection || (globalThis.__mongooseConnection = { conn: null, promise: null });

const connectToDB = async () => {
    if (cachedConnection.conn) {
        return cachedConnection.conn;
    }

    if (!cachedConnection.promise) {
        cachedConnection.promise = mongoose.connect(connectionUrl, {
            serverSelectionTimeoutMS: 10000,
            maxPoolSize: 10,
            socketTimeoutMS: 45000
        });
    }

    cachedConnection.conn = await cachedConnection.promise;
    return cachedConnection.conn;
};

export default connectToDB;

/*
I’m turning the database connection logic into a concise, comment-friendly explanation that matches the file’s purpose.

This file creates a single shared MongoDB connection so the app can reuse it efficiently instead of reconnecting every time.
 */