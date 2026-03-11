import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Check env vars
  if (!process.env.MONGODB_URI) {
    return res.status(500).json({ error: 'MONGODB_URI not set' });
  }
  
  if (!process.env.ADMIN_SECRET) {
    return res.status(500).json({ error: 'ADMIN_SECRET not set' });
  }

  const { secret, count = 1, days = 365 } = req.body;
  
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const generateKey = () => {
    let key = '';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) key += chars[Math.floor(Math.random() * chars.length)];
      if (i < 3) key += '-';
    }
    return key;
  };

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('innofusion');
    const licenses = db.collection('licenses');
    
    const keys = [];
    for (let i = 0; i < count; i++) {
      let key, exists = true;
      while (exists) {
        key = generateKey();
        exists = await licenses.findOne({ key });
      }
      
      await licenses.insertOne({
        key,
        tier: 'pro',
        features: ['preview', 'import', 'favorites'],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        activated: false,
        activations: []
      });
      keys.push(key);
    }
    
    res.json({ success: true, generated: keys.length, keys });
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Database connection failed',
      details: error.message 
    });
  } finally {
    await client.close();
  }
}
