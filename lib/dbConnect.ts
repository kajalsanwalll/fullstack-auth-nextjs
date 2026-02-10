import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI!;

let cached = (global as any).mongoose || {
  conn: null,
  promise: null,
};

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  (global as any).mongoose = cached;

  return cached.conn;
}
