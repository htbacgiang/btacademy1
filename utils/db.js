import dns from "dns";
import mongoose from "mongoose";
const connection = {};

async function connectDb() {
  try {
    if (connection.isConnected) {
      console.log("Already connected to the database.");
      return;
    }
    if (mongoose.connections.length > 0) {
      connection.isConnected = mongoose.connections[0].readyState;
      if (connection.isConnected === 1) {
        console.log("Use previous connection to the database.");
        return;
      }
      await mongoose.disconnect();
    }
    
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    
    const connectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
    };

    let db;
    try {
      db = await mongoose.connect(process.env.MONGODB_URI, connectOptions);
    } catch (error) {
      const shouldRetryWithCustomDns =
        process.env.MONGODB_URI?.startsWith("mongodb+srv://") &&
        (error?.code === "ECONNREFUSED" || `${error?.message || ""}`.includes("querySrv"));

      if (!shouldRetryWithCustomDns) {
        throw error;
      }

      const currentDnsServers = dns.getServers();
      const customDnsServers = (process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      dns.setServers(customDnsServers);
      try {
        db = await mongoose.connect(process.env.MONGODB_URI, connectOptions);
      } finally {
        dns.setServers(currentDnsServers);
      }
    }

    console.log("New connection to the database.");
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

async function disconnectDb() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("not disconnecting from the database.");
    }
  }
}
const db = { connectDb, disconnectDb };
export default db;
