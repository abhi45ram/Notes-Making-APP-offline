import Dexie from 'dexie';

export const db = new Dexie('NotesDatabase');

db.version(1).stores({
    notes: 'id,title,updatedAt,synced', 
});

db.version(2).stores({
    notes: 'id,title,updatedAt,synced',
}).upgrade((trans) => {
    return trans.notes.toCollection().modify((note) => {
        if (typeof note.synced !== 'boolean') {
            note.synced = false; 
        }
    });
});