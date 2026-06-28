import { MongoClient } from 'mongodb';

// 1. Check if the environment variable exists in your .env.local
if (!process.env.MONGODB_URI) {
  throw new Error('FATAL: Missing "MONGODB_URI" in your .env.local file.');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

// 2. The Next.js Development Cache Trick
if (process.env.NODE_ENV === 'development') {
  // In development mode, we use a global variable to preserve the connection
  // across module reloads. This stops your free database from crashing!
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // 3. Production Mode (When you deploy the site for the judges)
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// 4. Export the connection for Aviral to use in his backend APIs
export default clientPromise;