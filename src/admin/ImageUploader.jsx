import { useState } from 'react'

export function ImageUploader({ value, onChange, label }) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  return (
    <div className="grid gap-2 col-span-full sm:col-span-1">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <div className="flex flex-col gap-3">
        {value ? (
          <div className="relative group rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 aspect-video w-full max-w-[240px]">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-600 transition-colors"
                onClick={() => onChange('')}
              >
                Remove
              </button>
            </div>
          </div>
        ) : null}

        <input
          type="file"
          accept="image/*"
          className="block w-full max-w-sm rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 file:mr-4 file:rounded-xl file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white file:cursor-pointer hover:file:bg-black transition-colors focus:outline-none"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setError('')
            setStatus('uploading')
            
            try {
              const apiKey = import.meta.env.VITE_IMGBB_API_KEY
              if (!apiKey) {
                throw new Error('Please add VITE_IMGBB_API_KEY to your .env file to enable free image uploads.')
              }

              const formData = new FormData()
              formData.append('image', file)

              const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData
              })
              
              const data = await res.json()
              
              if (!res.ok || !data.success) {
                throw new Error(data.error?.message || 'Failed to upload to image host.')
              }

              onChange(data.data.url)
              setStatus('idle')
            } catch (err) {
              setStatus('idle')
              setError(err?.message || 'Upload failed.')
            }
          }}
        />
        {status === 'uploading' ? (
          <p className="text-xs font-medium text-zinc-500 animate-pulse">Uploading securely...</p>
        ) : null}
        {error ? <p className="text-xs font-bold text-rose-500">{error}</p> : null}
      </div>
    </div>
  )
}
