import 'dotenv/config';
import mongoose from 'mongoose';

async function testConnection() {
  const uri = process.env.MONGODB_URI;

  console.log('🔍 Testing MongoDB Connection...\n');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('URI format:', uri ? uri.substring(0, 20) + '...' : 'NOT SET');

  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env file');
    process.exit(1);
  }

  try {
    console.log('\n⏳ Attempting connection...');
    const startTime = Date.now();

    await mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      retryReads: true,
    });

    const elapsed = Date.now() - startTime;
    const db = mongoose.connection.db;
    const collections = await db?.listCollections().toArray();

    console.log('\n✅ Connection Successful!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    console.log('Connection Time:', elapsed + 'ms');
    console.log('Collections:', collections?.length || 0);
    console.log('Collection Names:', collections?.map((c) => c.name).join(', ') || 'none');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('✅ Connection closed gracefully\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Connection Failed!');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Error Type:', err.name);
    console.error('Error Message:', err.message);

    if (err.message.includes('IP')) {
      console.error('\n💡 IP Whitelist Issue:');
      console.error('  1. Go to MongoDB Atlas → Network Access');
      console.error('  2. Add current IP or use 0.0.0.0/0 for all IPs');
      console.error('  3. Wait 2-3 minutes for changes to propagate');
    }

    if (err.message.includes('authentication')) {
      console.error('\n💡 Authentication Issue:');
      console.error('  1. Check username and password in connection string');
      console.error('  2. Ensure password is URL encoded if it contains special chars');
      console.error('  3. Verify database user has correct permissions');
    }

    if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error('\n💡 DNS/Network Issue:');
      console.error('  1. Check internet connection');
      console.error('  2. Verify cluster hostname is correct');
      console.error('  3. Try using a different network');
    }

    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
      await mongoose.connection.close();
    } catch {}
    process.exit(1);
  }
}

testConnection();
