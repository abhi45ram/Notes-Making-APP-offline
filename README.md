# Getting Started with Create React App
##  Deployed Demo : https://notes-making-offlines.netlify.app/

# Setup Instructions
# 1. Clone the Repository

git clone  https://github.com/abhi45ram/Notes-Making-APP-offline.git
cd my-notes-app
 2. Install Dependencies
npm install

# 3. Start the Mock Backend (json-server)

npx json-server --watch db.json --port 3001
Make sure db.json is present in the root with the following initial content:
Edit
{
  "notes": []
}

# 4. Start the React App

npm start


# Sync & Connectivity Behavior
Uses navigator.onLine and event listeners to detect connectivity.

Offline changes are stored locally in IndexedDB.

When online, all changes are synced automatically via REST endpoints:

GET /notes

POST /notes

PUT /notes/:id

DELETE /notes/:id

## Design Decisions
Offline Storage
Dexie (via idb) is used to simplify IndexedDB operations.

Notes include a synced flag to track sync state.

Sync Strategy
Last-write-wins based on updatedAt timestamp.

Sync is initiated whenever:

App comes online.

Local changes occur while online.

# Autosave
Title and content edits trigger autosave after 500ms of inactivity using a custom debounce hook.

# Assumptions & Limitations
Conflict resolution is basic: latest timestamp wins. No UI for manual conflict resolution yet.

Only supports one user/session — multi-user support is not implemented.

No authentication or login.

PWA/service worker not included (can be added for full offline installability).

# Testing the App
To simulate offline mode:

Open DevTools → Network → "Offline"

Add/edit/delete notes — you’ll see status: Unsynced

Reconnect — watch sync happen in real-time


