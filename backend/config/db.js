import dns from 'dns'
import mongoose from 'mongoose'

function getAtlasSrvHost(mongoUri) {
  // mongodb+srv://user:pass@cluster.domain.net/db?...
  const match = mongoUri?.match(/^mongodb\+srv:\/\/[^@]+@([^/]+)/i)
  return match?.[1] ?? null
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI
    console.log('MONGO_URI loaded:', Boolean(uri))
    const clusterHost = getAtlasSrvHost(uri)
    console.log('MongoDB SRV host:', clusterHost)

    // Workaround for environments where Node's default DNS resolver
    // can't reach public DNS (causes mongodb+srv to fail with ECONNREFUSED).
    dns.setServers(['1.1.1.1', '8.8.8.8'])
    if (clusterHost) {
      const srvName = `_mongodb._tcp.${clusterHost}`
      try {
        const records = await dns.promises.resolveSrv(srvName)
        console.log('SRV lookup OK:', records?.length ?? 0)
      } catch (e) {
        // Keep going; mongoose will surface the actual connection error.
        console.log('SRV lookup failed:', e?.code ?? e?.message)
      }
    }

    await mongoose.connect(uri, {
      tls: true,
      authSource: 'admin',
      serverSelectionTimeoutMS: 60000,
    })
    console.log('MongoDB Connected')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default connectDB