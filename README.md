# Personal Portfolio (React + Firebase)

Modern portfolio built with **React (Vite)** + **Tailwind CSS** and backed by **Firebase Firestore**:

- **Projects** load from Firestore collection `projects` (with a local fallback).
- **Contact form** writes submissions to Firestore collection `contact_submissions`.

## Run locally

```bash
npm install
npm run dev
```

## Firebase setup

1. Create a Firebase project in the Firebase Console.
2. Create a Firestore database.
3. Create a Web App in Firebase and copy its config.
4. Create a `.env` file (or copy `.env.example` to `.env`) and fill in:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Restart the dev server after editing env vars.

## Firestore data model

### `projects` (collection)

Each document can have:

- `title` (string)
- `description` (string)
- `tags` (array of strings)
- `liveUrl` (string, optional)
- `sourceUrl` (string, optional)
- `order` (number, optional)

### `contact_submissions` (collection)

Created by the contact form with:

- `name` (string)
- `email` (string)
- `message` (string)
- `createdAt` (timestamp)
- `userAgent`, `referrer`, `url`

## Suggested Firestore rules (basic)

Start strict: allow public reads of `projects`, block writes; allow creating contact submissions only.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{doc} {
      allow read: if true;
      allow write: if false;
    }

    match /contact_submissions/{doc} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

## Customize content

Update the `PROFILE` object inside `src/App.jsx` (name, links, skills, etc.).
