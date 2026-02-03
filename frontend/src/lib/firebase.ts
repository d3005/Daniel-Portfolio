import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQjjZIS-DTwMfq0qtONrTZjberb9-0h7c",
  authDomain: "porrtfolio-c212c.firebaseapp.com",
  databaseURL: "https://porrtfolio-c212c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "porrtfolio-c212c",
  storageBucket: "porrtfolio-c212c.firebasestorage.app",
  messagingSenderId: "159965497345",
  appId: "1:159965497345:web:68876a1ad7906fda821800",
  measurementId: "G-8L3N401GC2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Initialize Analytics (only in browser)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Database helper functions
export const fetchPortfolioData = async () => {
  const dbRef = ref(database);
  try {
    const snapshot = await get(child(dbRef, 'portfolio'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export { app, database, auth, analytics };
