import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

let app;
let database;

// Check if we have service account credentials
if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  app = initializeApp({
    credential: cert(serviceAccount as any),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  database = getDatabase(app);
} else if (process.env.FIREBASE_DATABASE_URL) {
  // Initialize without credentials for emulator or public database
  app = initializeApp({
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  database = getDatabase(app);
}

// Fetch portfolio data from Firebase
export const fetchPortfolioDataFromFirebase = async () => {
  if (!database) {
    throw new Error('Firebase database not initialized');
  }
  
  const ref = database.ref('portfolio');
  const snapshot = await ref.once('value');
  return snapshot.val();
};

// Update portfolio data in Firebase
export const updatePortfolioData = async (data: any) => {
  if (!database) {
    throw new Error('Firebase database not initialized');
  }
  
  const ref = database.ref('portfolio');
  await ref.set(data);
  return { success: true };
};

export { database };
