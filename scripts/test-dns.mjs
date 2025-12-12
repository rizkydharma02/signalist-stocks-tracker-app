import dns from 'dns';
import { promisify } from 'util';

const resolveSrv = promisify(dns.resolveSrv);
const resolve4 = promisify(dns.resolve4);

const MONGODB_HOSTNAME = 'cluster0.z0nou9i.mongodb.net';
const MONGODB_SRV = '_mongodb._tcp.' + MONGODB_HOSTNAME;

console.log('🔍 Testing MongoDB DNS Resolution\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Test 1: DNS Servers
console.log('\n1️⃣ Current DNS Servers:');
const dnsServers = dns.getServers();
console.log(dnsServers.join(', '));

// Test 2: Hostname resolution (A record)
console.log('\n2️⃣ Testing hostname resolution (A record)...');
try {
  const addresses = await resolve4(MONGODB_HOSTNAME);
  console.log('✅ Hostname resolves to:', addresses.join(', '));
} catch (err) {
  console.log('❌ Cannot resolve hostname:', err.message);
  console.log('   Try: nslookup', MONGODB_HOSTNAME);
}

// Test 3: SRV record (MongoDB Atlas uses this)
console.log('\n3️⃣ Testing SRV record resolution...');
try {
  const srvRecords = await resolveSrv(MONGODB_SRV);
  console.log('✅ SRV records found:', srvRecords.length);
  srvRecords.forEach((record, i) => {
    console.log(`   ${i + 1}. ${record.name}:${record.port} (priority: ${record.priority})`);
  });
} catch (err) {
  console.log('❌ Cannot resolve SRV record:', err.message);
  console.log('\n💡 This is the issue! Possible solutions:');
  console.log('   1. Change DNS to Google DNS (8.8.8.8, 8.8.4.4)');
  console.log('   2. Change DNS to Cloudflare (1.1.1.1, 1.0.0.1)');
  console.log('   3. Use standard connection string (not mongodb+srv://)');
  console.log('   4. Check if VPN/Firewall is blocking DNS queries');
  console.log('   5. Try different network (mobile hotspot, etc.)');
}

// Test 4: Individual shard hosts
console.log('\n4️⃣ Testing shard hosts resolution...');
const shardHosts = ['cluster0-shard-00-00.z0nou9i.mongodb.net', 'cluster0-shard-00-01.z0nou9i.mongodb.net', 'cluster0-shard-00-02.z0nou9i.mongodb.net'];

for (const host of shardHosts) {
  try {
    const addresses = await resolve4(host);
    console.log(`✅ ${host} → ${addresses[0]}`);
  } catch (err) {
    console.log(`❌ ${host} → Cannot resolve`);
  }
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n📝 Summary:');
console.log('If SRV record test failed, you need to either:');
console.log('  A) Fix DNS settings (recommended)');
console.log('  B) Get standard connection string from MongoDB Atlas');
console.log('\nTo get standard connection string:');
console.log('  1. Go to MongoDB Atlas → Connect');
console.log('  2. Choose "Connect your application"');
console.log('  3. Toggle "Include full driver code example"');
console.log('  4. Look for connection string without +srv\n');
