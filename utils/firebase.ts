import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, CustomProvider } from "firebase/app-check";
import firebaseConfig from '../firebase-applet-config.json';

// Set debug token before initialization
if (typeof window !== "undefined") {
  // @ts-ignore
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize App Check with a more flexible provider for the preview environment
if (typeof window !== "undefined") {
  try {
    initializeAppCheck(app, {
      provider: new CustomProvider({
        getToken: () => {
          return Promise.resolve({
            token: "debug-token", // This is ignored if FIREBASE_APPCHECK_DEBUG_TOKEN is true
            expireTimeMillis: Date.now() + 1000 * 60 * 60,
          });
        },
      }),
      isTokenAutoRefreshEnabled: true
    });
    console.log("Firebase App Check initialized in debug mode.");
  } catch (err) {
    console.error("Firebase App Check failed to initialize:", err);
  }
}

// Initialize Firebase services
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId); 
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
