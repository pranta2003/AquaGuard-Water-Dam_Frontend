/**
 * Firebase CLIENT SDK config (browser-side, read-only for this app).
 * This is different from the backend's firebase-admin service account —
 * this uses your Firebase Web App config (Console -> Project Settings ->
 * General -> Your apps -> Web app -> SDK setup and configuration).
 *
 * These values are safe to expose in client-side code (they're not
 * secrets); access control is enforced by your Firebase Realtime
 * Database security rules, not by hiding this config.
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // e.g. https://<project-id>-default-rtdb.firebaseio.com
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// Avoid re-initializing on Next.js hot reloads
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getDatabase(app);
