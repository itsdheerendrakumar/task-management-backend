import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (error) {
  console.warn("Failed to set DNS servers:", error);
}

export async function connectDB() {
  try {
    const connStr = process.env.DATABASE_URL;
    if (!connStr) {
      throw new Error("DATABASE_URL env variable is not defined");
    }
    await mongoose.connect(connStr);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}
