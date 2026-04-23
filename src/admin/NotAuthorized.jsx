export default function NotAuthorized() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl surface p-6">
        <h1 className="text-xl font-semibold text-white">Not authorized</h1>
        <p className="mt-2 text-sm text-white/70">
          Your user is signed in, but not marked as an admin in Firestore.
        </p>
        <p className="mt-4 text-sm text-white/60">
          Fix: create a document at <code className="text-white/80">admins/&lt;your-uid&gt;</code>{' '}
          in Firestore.
        </p>
      </div>
    </div>
  )
}

