import { db } from '../db/indexedDB';

const API_URL = 'http://localhost:3001/notes';

export async function syncNotesWithServer() {
    const allNotes = await db.notes.toArray();
console.log('All Notes:', allNotes);
    const unsyncedNotes = await db.notes
  .where('synced')
  .equals(false)
  .toArray()
  .catch((err) => {
    console.error('Error querying unsynced notes:', err);
    return [];
  });
  for (const note of unsyncedNotes) {
    try {
      await db.notes.update(note.id, { syncStatus: 'Syncing...' });
  
      const res = await fetch(`${API_URL}/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      console.log(`Sync response for note ${note.id}:`, res.status, res.statusText);

      if (res.ok) {
        await db.notes.update(note.id, { synced: true, syncStatus: 'Synced' });
        const updatedNote = await db.notes.get(note.id);
  console.log(`Updated note ${note.id}:`, updatedNote);
      } else {
        await db.notes.update(note.id, { syncStatus: 'Error' });
      }
    } catch (err) {
      console.error('Sync failed for note', note.id, err);
      await db.notes.update(note.id, { syncStatus: 'Error' });
    }
  }
  }
  
