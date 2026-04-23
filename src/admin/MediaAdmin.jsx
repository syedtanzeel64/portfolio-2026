import { useState } from 'react'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { getStorageClient } from '../lib/firebase'

export default function MediaAdmin() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [url, setUrl] = useState('')

  return (
    <div className="surface p-8 border border-zinc-200 shadow-sm rounded-2xl bg-white">
      <h2 className="text-xl font-bold text-zinc-900">Media Library</h2>
      <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
        Upload an image (like your portrait or a project thumbnail) here. Once uploaded, a link will be generated.
        <br/><strong className="text-zinc-900 mt-1 block">Copy this link and paste it into the "Settings" or "Projects" tabs.</strong>
      </p>

      <div className="mt-8 grid gap-6">
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setError('')
            setUrl('')
            setStatus('uploading')
            try {
              const storage = getStorageClient()
              if (!storage) throw new Error('Firebase not configured.')
              const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
              const path = `media/${Date.now()}_${safeName}`
              const r = ref(storage, path)
              await uploadBytes(r, file)
              const downloadUrl = await getDownloadURL(r)
              setUrl(downloadUrl)
              setStatus('done')
            } catch (err) {
              setStatus('idle')
              setError(err?.message || 'Upload failed.')
            }
          }}
          className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 file:mr-4 file:rounded-xl file:border-0 file:bg-zinc-900 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-white file:cursor-pointer hover:file:bg-black transition-colors focus:outline-none"
        />

        {status === 'uploading' ? (
          <p className="text-sm font-medium text-zinc-500 animate-pulse">Uploading securely to Firebase...</p>
        ) : null}

        {error ? <p className="text-sm font-bold text-rose-500">{error}</p> : null}

        {url ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Successfully Uploaded!</p>
            <p className="mt-1 text-sm text-emerald-800">Your Image URL (Copy this):</p>
            <input
              readOnly
              value={url}
              className="mt-3 h-12 w-full rounded-xl border border-emerald-200 bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              onClick={(e) => {
                e.target.select()
                navigator.clipboard.writeText(url)
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

