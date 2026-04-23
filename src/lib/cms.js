import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { getDb } from './firebase'

export const CMS_DEFAULTS = {
  settings: {
    siteName: 'Syed Tanzeel',
    tagline: 'Full Stack Developer',
    location: 'Remote',
    email: 'hi@example.com',
    phone: '',
    address: '',
    logoUrl: '',
    heroImage: '',
    aboutImage: '',
    heroTitle: "Hi, I'm Syed Tanzeel",
    heroSubtitles: "Full Stack Developer, UI/UX Designer, Problem Solver",
    aboutBio: "I craft elegant and responsive frontend experiences...",
    socials: {
      github: 'https://github.com/',
      linkedin: 'https://linkedin.com/',
      instagram: '',
      x: '',
    },
    stats: [
      { label: 'Years Experience', value: '3+' },
      { label: 'Projects Delivered', value: '25+' },
      { label: 'Happy Clients', value: '10+' },
    ],
    updatedAt: null,
  },
}

export async function getSettings() {
  const db = getDb()
  if (!db) return CMS_DEFAULTS.settings
  const ref = doc(db, 'site', 'settings')
  const snap = await getDoc(ref)
  if (!snap.exists()) return CMS_DEFAULTS.settings
  return { ...CMS_DEFAULTS.settings, ...snap.data() }
}

export async function saveSettings(partial) {
  const db = getDb()
  if (!db) throw new Error('Firebase not configured.')
  const ref = doc(db, 'site', 'settings')
  await setDoc(ref, { ...partial, updatedAt: serverTimestamp() }, { merge: true })
}

export async function listCollection(name, { orderField = 'order', max = 50 } = {}) {
  const db = getDb()
  if (!db) return []
  const q = query(collection(db, name), orderBy(orderField, 'asc'), limit(max))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function createItem(name, data) {
  const db = getDb()
  if (!db) throw new Error('Firebase not configured.')
  const payload = { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
  const ref = await addDoc(collection(db, name), payload)
  return ref.id
}

export async function updateItem(name, id, data) {
  const db = getDb()
  if (!db) throw new Error('Firebase not configured.')
  const ref = doc(db, name, id)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export async function deleteItem(name, id) {
  const db = getDb()
  if (!db) throw new Error('Firebase not configured.')
  await deleteDoc(doc(db, name, id))
}

