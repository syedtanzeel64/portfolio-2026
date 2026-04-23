import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

function getFirebaseConfig() {
  const {
    VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID,
  } = import.meta.env

  const hasAll =
    VITE_FIREBASE_API_KEY &&
    VITE_FIREBASE_AUTH_DOMAIN &&
    VITE_FIREBASE_PROJECT_ID &&
    VITE_FIREBASE_STORAGE_BUCKET &&
    VITE_FIREBASE_MESSAGING_SENDER_ID &&
    VITE_FIREBASE_APP_ID

  if (!hasAll) return null

  return {
    apiKey: VITE_FIREBASE_API_KEY,
    authDomain: VITE_FIREBASE_AUTH_DOMAIN,
    projectId: VITE_FIREBASE_PROJECT_ID,
    storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: VITE_FIREBASE_APP_ID,
  }
}

export function getFirebaseApp() {
  const existing = getApps()
  if (existing.length) return existing[0]

  const config = getFirebaseConfig()
  if (!config) return null

  return initializeApp(config)
}

export function getDb() {
  const app = getFirebaseApp()
  if (!app) return null
  return getFirestore(app)
}

export function getAuthClient() {
  const app = getFirebaseApp()
  if (!app) return null
  return getAuth(app)
}

export function getStorageClient() {
  const app = getFirebaseApp()
  if (!app) return null
  return getStorage(app)
}

