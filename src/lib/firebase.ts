import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Configure Google Auth Provider with Google Workspace Scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
googleProvider.addScope('https://www.googleapis.com/auth/meetings.space.created');
googleProvider.addScope('https://www.googleapis.com/auth/meetings.space.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/forms.body');
googleProvider.addScope('https://www.googleapis.com/auth/tasks');
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// In-memory / session access token cache
let cachedAccessToken: string | null = sessionStorage.getItem('meuus_google_access_token');

export function setGoogleAccessToken(token: string | null) {
  cachedAccessToken = token;
  if (token) {
    sessionStorage.setItem('meuus_google_access_token', token);
  } else {
    sessionStorage.removeItem('meuus_google_access_token');
  }
}

export function getGoogleAccessToken(): string | null {
  return cachedAccessToken || sessionStorage.getItem('meuus_google_access_token');
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken || null;
  if (token) {
    setGoogleAccessToken(token);
  }
  return { user: result.user, token };
}

export async function logoutUser() {
  setGoogleAccessToken(null);
  await signOut(auth);
}

// Initialize Firestore
export const firestore = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || '(default)');
export const db = firestore;

export { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  addDoc, 
  serverTimestamp 
};

export type { User };
