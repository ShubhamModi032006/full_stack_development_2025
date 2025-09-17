// lib/mongodb.js
import { MongoClient } from 'mongodb';

<<<<<<< HEAD
const MONGODB_URI = 'mongodb+srv://Shubham:NITa%401234@cluster0.z5xy2.mongodb.net/DB_ASSI';
=======
const MONGODB_URI = 'Your Mongodb connection url';
>>>>>>> 7dcf11bc180a6097a0630f9e2ab5c0c1a21d5056

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required.');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // preserve across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;
