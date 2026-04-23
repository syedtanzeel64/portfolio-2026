import { useEffect, useMemo, useState } from 'react'
import { createItem, deleteItem, listCollection, updateItem } from '../lib/cms'
import { ImageUploader } from './ImageUploader'

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      {type === 'textarea' ? (
        <textarea
          className="min-h-[110px] resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  )
}

export default function CollectionCrudPage({ title, collectionName, schema }) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // {id, data}
  const [saving, setSaving] = useState(false)

  const empty = useMemo(() => {
    const base = {}
    for (const f of schema) base[f.key] = f.defaultValue ?? ''
    return base
  }, [schema])

  async function refresh() {
    setError('')
    setStatus('loading')
    try {
      const data = await listCollection(collectionName, { orderField: 'order', max: 100 })
      setItems(data)
      setStatus('ready')
    } catch (e) {
      setError(e?.message || 'Failed to load.')
      setStatus('error')
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      <div className="surface p-6 border border-zinc-200 bg-white rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Create, edit, reorder (via `order`), and delete items.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditing({ id: null, data: { ...empty, order: items.length + 1 } })}
            className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-black transition-colors shadow-sm"
          >
            Add new
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100/80">
            {error}
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {status === 'loading' ? (
          <div className="text-zinc-500 font-medium">Loading…</div>
        ) : null}
        {items.map((it) => (
          <div key={it.id} className="surface p-6 border border-zinc-200 bg-white rounded-xl shadow-sm relative overflow-hidden group">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-lg font-bold text-zinc-900">
                  {it.title || it.name || it.label || it.id}
                </p>
                <p className="mt-1 text-xs font-mono text-zinc-400">id: {it.id}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing({ id: it.id, data: { ...it } })}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm('Delete this item?')) return
                    setSaving(true)
                    try {
                      await deleteItem(collectionName, it.id)
                      await refresh()
                    } catch (e) {
                      setError(e?.message || 'Delete failed.')
                    } finally {
                      setSaving(false)
                    }
                  }}
                  className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                  disabled={saving}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-zinc-600 border-t border-zinc-100 pt-4">
              {schema
                .filter((f) => f.preview)
                .map((f) => (
                  <p key={f.key} className="truncate">
                    <span className="font-medium text-zinc-400 uppercase tracking-wider text-xs">{f.label}:</span>{' '}
                    {Array.isArray(it[f.key]) ? it[f.key].join(', ') : String(it[f.key] ?? '')}
                  </p>
                ))}
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <div className="surface p-8 border border-zinc-200 bg-zinc-50 rounded-2xl shadow-sm mt-8">
          <div className="mb-6 flex items-start justify-between gap-4 pb-6 border-b border-zinc-200">
            <div>
              <h3 className="text-xl font-bold text-zinc-900">
                {editing.id ? 'Edit item' : 'Create item'}
              </h3>
              <p className="mt-1 text-sm font-medium text-zinc-500">
                Collection: <code className="text-zinc-600 bg-zinc-200/50 px-2 py-0.5 rounded-md font-mono">{collectionName}</code>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {schema.map((f) => {
              const val = editing.data[f.key]
              const setVal = (v) =>
                setEditing((e) => ({ ...e, data: { ...e.data, [f.key]: v } }))

              if (f.type === 'tags') {
                return (
                  <Field
                    key={f.key}
                    label={f.label}
                    value={Array.isArray(val) ? val.join(', ') : String(val || '')}
                    onChange={(s) =>
                      setVal(
                        s
                          .split(',')
                          .map((x) => x.trim())
                          .filter(Boolean),
                      )
                    }
                    placeholder={f.placeholder || 'tag1, tag2'}
                  />
                )
              }

              if (f.type === 'image') {
                return (
                  <ImageUploader
                    key={f.key}
                    label={f.label}
                    value={val || ''}
                    onChange={setVal}
                  />
                )
              }

              return (
                <Field
                  key={f.key}
                  label={f.label}
                  value={val ?? ''}
                  onChange={setVal}
                  placeholder={f.placeholder || f.label}
                  type={f.type === 'textarea' ? 'textarea' : 'text'}
                />
              )
            })}
          </div>

          <div className="mt-8 flex gap-3 pt-6 border-t border-zinc-200">
            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                setError('')
                setSaving(true)
                try {
                  const data = { ...editing.data }
                  if (editing.id) await updateItem(collectionName, editing.id, data)
                  else await createItem(collectionName, data)
                  setEditing(null)
                  await refresh()
                } catch (e) {
                  setError(e?.message || 'Save failed.')
                } finally {
                  setSaving(false)
                }
              }}
              className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white hover:bg-black transition-colors shadow-md disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

