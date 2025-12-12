/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (!MONGODB_URI) throw new Error('MONGODB_URI must be set within .env');

  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 30000, // delay 30 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      // MongoDB driver options
      retryWrites: true,
      retryReads: true,
      // DNS dan TLS options
      tls: true,
      tlsAllowInvalidCertificates: false,
      // role options
      authSource: 'admin',
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log(`✅ MongoDB Connected: ${cached.conn.connection.name}`);
    console.log(`   Host: ${cached.conn.connection.host}`);
    console.log(`   Ready State: ${cached.conn.connection.readyState}`);
  } catch (err: any) {
    cached.promise = null;

    console.error('❌ MongoDB Connection Failed');
    console.error('Error:', err.message);

    if (err.message?.includes('ESERVFAIL') || err.message?.includes('querySrv')) {
      console.error('\n💡 DNS Issue detected. Solutions:');
      console.error('  1. Wait 2-3 minutes for DNS propagation');
      console.error('  2. Restart your computer/router');
      console.error('  3. Try different network (mobile hotspot)');
      console.error('  4. Use standard connection string');
    }

    if (err.message?.includes('ENOTFOUND') || err.message?.includes('getaddrinfo')) {
      console.error('\n💡 Hostname resolution failed.');
      console.error('  The SRV records point to: ac-fukrroq-shard-*.z0nou9i.mongodb.net');
      console.error('  But individual hosts cannot be resolved.');
      console.error('  This usually resolves itself after DNS propagation.');
    }

    if (err.message?.includes('authentication')) {
      console.error('\n💡 Authentication failed.');
      console.error('  Check username and password in connection string');
    }

    throw err;
  }

  return cached.conn;
};
