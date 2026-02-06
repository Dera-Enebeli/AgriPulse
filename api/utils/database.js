/**
 * Database utility for serverless functions
 * Implements connection pooling and caching for Vercel serverless environment
 */

const { MongoClient } = require('mongodb');

// Global database connection - cached between function calls
let cachedDb = null;
let client = null;

if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
  throw new Error('MONGODB_URI environment variable is required in production');
}

/**
 * Connect to MongoDB database with connection pooling
 * Optimized for serverless environments
 */
async function connectToDatabase() {
  // If we already have a connection, reuse it
  if (cachedDb) {
    return cachedDb;
  }

  // If client exists but no database reference, create one
  if (client && !cachedDb) {
    cachedDb = client.db();
    return cachedDb;
  }

  // Create new MongoDB connection with serverless-optimized options
  client = new MongoClient(process.env.MONGODB_URI, {
    maxPoolSize: 10, // Maximum number of connections in the pool
    serverSelectionTimeoutMS: 5000, // How long to try selecting a server before giving up
    socketTimeoutMS: 45000, // How long a send or receive on a socket can take before timing out
    connectTimeoutMS: 10000, // How long to wait for initial connection
    retryWrites: true,
    w: 'majority'
  });

  try {
    await client.connect();
    
    // Extract database name from connection string or use default
    const dbName = process.env.MONGODB_URI.split('/').pop().split('?')[0] || 'agripulse_prod';
    cachedDb = client.db(dbName);
    
    console.log('Connected to MongoDB');
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Close database connection (cleanup for serverless)
 */
async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    client = null;
    cachedDb = null;
  }
}

/**
 * Get database collection with error handling
 */
async function getCollection(collectionName) {
  const db = await connectToDatabase();
  return db.collection(collectionName);
}

/**
 * Database health check
 */
async function checkDatabaseHealth() {
  try {
    const db = await connectToDatabase();
    await db.admin().ping();
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
  }
}

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  getCollection,
  checkDatabaseHealth
};