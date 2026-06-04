import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

// Global interface for TypeScript to recognize our cached mongoose instance
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

const CONNECTION_OPTIONS: mongoose.ConnectOptions = {
  bufferCommands: false, // Fail immediately if not connected (don't queue)
  maxPoolSize: 10, // Max simultaneous connections (tune to workload)
  minPoolSize: 2, // Keep at least 2 connections warm
  serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB is unreachable (default: 30s)
  socketTimeoutMS: 45000, // Close idle sockets after 45s
  connectTimeoutMS: 10000, // Give up connecting after 10s
  family: 4, // Force IPv4 — avoids slow dual-stack DNS lookups
  heartbeatFrequencyMS: 10000, // Check connection health every 10s
};

// Initialize global cache (survives Next.js hot-reloads in development)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// -- Event listeners (registered once) ---------------------------------------

mongoose.connection.on("connected", () => {
  if (process.env.NODE_ENV === "development") {
    console.log("MongoDB connected");
  }
});

mongoose.connection.on("disconnected", () => {
  if (process.env.NODE_ENV === "development") {
    console.warn("MongoDB disconnected");
  }
  // Reset cache so the next call re-establishes the connection
  cached.conn = null;
  cached.promise = null;
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  cached.conn = null;
  cached.promise = null;
});

// -- Graceful shutdown -------------------------------------------------------

const gracefulShutdown = async (signal: string) => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    if (process.env.NODE_ENV === "development") {
      console.log(`MongoDB disconnected on ${signal}`);
    }
  }
};

process.once("SIGINT", () => gracefulShutdown("SIGINT"));
process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));

// -- Connection function ------------------------------------------------------

async function connectToDatabase(): Promise<mongoose.Connection> {
  // 1. Happy path: existing, live connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // 2. No in-flight promise yet — kick off a new connection
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI!, CONNECTION_OPTIONS)
      .then((m) => m.connection);
  }

  // 3. Await the in-flight promise (shared across concurrent callers)
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so the next invocation can retry cleanly
    cached.promise = null;
    cached.conn = null;
    throw err;
  }

  return cached.conn;
}

export default connectToDatabase;
