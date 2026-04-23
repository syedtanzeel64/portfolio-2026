import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore'
import { getDb } from './firebase'

export const FALLBACK_PROJECTS = [
  {
    id: 'project-one',
    title: 'Home | The Leon',
    description:
      'A hospitality-style Core PHP website with bold sections, strong CTAs, and image-first layout.',
    tags: ['Core PHP', 'HTML/CSS', 'UI'],
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    liveUrl: 'https://www.theleon.in/',
    sourceUrl: '',
    order: 1,
    category: 'Web',
  },
  {
    id: 'project-two',
    title: 'Jamiat-un-Noor - HOME',
    description:
      'An education-institute style Core PHP website with facilities, events, testimonials, and structured content sections.',
    tags: ['Core PHP', 'UI', 'Content'],
    imageUrl:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80',
    liveUrl: 'https://www.jamianoor.com/',
    sourceUrl: '',
    order: 2,
    category: 'Web',
  },
  {
    id: 'project-three',
    title: 'Govt. Model HSS Kunzer',
    description:
      'A large multi-section Core PHP public website: news, gallery, staff, testimonials, and structured navigation.',
    tags: ['Core PHP', 'UI', 'Responsive'],
    imageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    liveUrl: 'https://gmhsskunzer.com/',
    sourceUrl: '',
    order: 3,
    category: 'Web',
  },
  {
    id: 'project-four',
    title: 'Kashklean Srinagar',
    description:
      'A services-forward Core PHP website with repeating hero blocks, service cards, and step-by-step workflow sections.',
    tags: ['Core PHP', 'UI', 'Conversion'],
    imageUrl:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
    liveUrl: 'https://kashklean.in/',
    sourceUrl: '',
    order: 4,
    category: 'Web',
  },
]

export async function fetchProjects() {
  const db = getDb()
  if (!db) return FALLBACK_PROJECTS

  // Prefer CMS-managed projects collection if present.
  const q = query(
    collection(db, 'projects'),
    orderBy('order', 'asc'),
    limit(12),
  )

  const snap = await getDocs(q)
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return items.length ? items : FALLBACK_PROJECTS
}

export async function fetchServicesFallback() {
  const db = getDb()
  if (!db) return []
  const q = query(collection(db, 'services'), orderBy('order', 'asc'), limit(50))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function fetchTestimonialsFallback() {
  const db = getDb()
  if (!db) return []
  const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'), limit(50))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function fetchSettingsFallback() {
  const db = getDb()
  if (!db) return null
  const ref = doc(db, 'site', 'settings')
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : null
}

export async function submitContactMessage({ name, email, message }) {
  const db = getDb()
  if (!db) {
    throw new Error(
      'Firebase is not configured. Add VITE_FIREBASE_* env vars to enable contact submissions.',
    )
  }

  const payload = {
    name: String(name || '').trim(),
    email: String(email || '').trim(),
    message: String(message || '').trim(),
    createdAt: serverTimestamp(),
    userAgent: navigator.userAgent,
    referrer: document.referrer || null,
    url: location.href,
  }

  if (!payload.name || !payload.email || !payload.message) {
    throw new Error('Please fill name, email, and message.')
  }

  await addDoc(collection(db, 'contact_submissions'), payload)
}

