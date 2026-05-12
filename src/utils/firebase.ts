import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import firebaseConfig from '../firebase-applet-config.json';

// Removed debug token


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// AppCheck removed for local development to prevent permission errors

// Initialize Firebase services
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export default app;
