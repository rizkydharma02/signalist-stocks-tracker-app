import dns from 'dns';
import { promisify } from 'util';
import net from 'net';

const resolve4 = promisify(dns.resolve4);

// Hostnames srv record
const actualHosts = ['ac-fukrroq-shard-00-00.z0nou9i.mongodb.net', 'ac-fukrroq-shard-00-01.z0nou9i.mongodb.net', 'ac-fukrroq-shard-00-02.z0nou9i.mongodb.net'];

console.log('🔍 Testing Actual MongoDB Shard Hosts\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

async function testHost(hostname, port = 27017) {
  console.log(`\n📡 Testing: ${hostname}`);

  // Test 1: DNS Resolution
  try {
    const addresses = await resolve4(hostname);
    console.log(`  ✅ DNS resolves to: ${addresses[0]}`);

    // Test 2: TCP Connection
    return new Promise((resolve) => {
      const socket = net.createConnection({ host: hostname, port, timeout: 5000 });

      socket.on('connect', () => {
        console.log(`  ✅ TCP connection successful on port ${port}`);
        socket.destroy();
        resolve(true);
      });

      socket.on('timeout', () => {
        console.log(`  ⚠️  TCP connection timeout (port ${port})`);
        socket.destroy();
        resolve(false);
      });

      socket.on('error', (err) => {
        console.log(`  ❌ TCP connection failed: ${err.message}`);
        socket.destroy();
        resolve(false);
      });
    });
  } catch (err) {
    console.log(`  ❌ DNS resolution failed: ${err.message}`);
    return false;
  }
}

async function main() {
  let allSuccess = true;

  for (const host of actualHosts) {
    const success = await testHost(host);
    if (!success) allSuccess = false;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (allSuccess) {
    console.log('\n✅ All hosts are reachable!');
    console.log('Your MongoDB connection should work now.');
    console.log('\nTry running: npm run dev');
  } else {
    console.log('\n⚠️  Some hosts are not reachable.');
    console.log('\n💡 Possible solutions:');
    console.log('  1. Wait 2-5 minutes for DNS propagation');
    console.log('  2. Flush DNS cache:');
    console.log('     Windows: ipconfig /flushdns');
    console.log('     macOS: sudo dscacheutil -flushcache');
    console.log('     Linux: sudo systemd-resolve --flush-caches');
    console.log('  3. Restart your router/computer');
    console.log('  4. Try mobile hotspot');
    console.log('  5. Check firewall settings (allow port 27017)');
  }

  console.log('\n');
}

main().catch(console.error);
