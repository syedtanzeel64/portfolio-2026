import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { getAuthClient, getDb } from './firebase'

export function watchAuth(cb) {
  const auth = getAuthClient()
  if (!auth) {
    cb({ user: null, isAdmin: false, ready: true, error: 'Firebase not configured.' })
    return () => {}
  }

  return onAuthStateChanged(
    auth,
    async (user) => {
      if (!user) {
        cb({ user: null, isAdmin: false, ready: true, error: '' })
        return
      }

      try {
        const db = getDb()
        if (!db) throw new Error('Firebase not configured.')
        const adminRef = doc(db, 'admins', user.uid)
        const adminSnap = await getDoc(adminRef)
        cb({ user, isAdmin: adminSnap.exists(), ready: true, error: '' })
      } catch (e) {
        cb({ user, isAdmin: false, ready: true, error: e?.message || 'Auth error.' })
      }
    },
    (err) => cb({ user: null, isAdmin: false, ready: true, error: err?.message || 'Auth error.' }),
  )
}

export async function adminLogin(email, password) {
  const auth = getAuthClient()
  if (!auth) throw new Error('Firebase not configured.')
  await signInWithEmailAndPassword(auth, email, password)
}

export async function adminLogout() {
  const auth = getAuthClient()
  if (!auth) return
  await signOut(auth)
}

