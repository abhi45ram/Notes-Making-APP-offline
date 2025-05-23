import React, { useContext, useState } from 'react';
import { NotesContext } from '../context/NotesContext';

export default function NoteList({ onSelectNote }) {
  const { notes, deleteNote, createNote } = useContext(NotesContext);
  const [search, setSearch] = useState('');

  const filteredNotes = notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const handleAddNote = async () => {
    const newNote = await createNote();
    onSelectNote(newNote.id); 
  };

  return (
    <div className="note-list">
      <button onClick={handleAddNote}>+ Add Note</button>
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <ul>
        {filteredNotes.map((note) => (
          <li
            key={note.id}
            className="note-list-item"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div onClick={() => onSelectNote(note.id)} style={{ cursor: 'pointer', flex: 1 }}>
              <strong>{note.title || 'Untitled'}</strong>
              <br />
              <small>{new Date(note.updatedAt).toLocaleString()}</small>
              <br />
              <small>
                {note.syncStatus || (note.synced ? 'Synced' : 'Unsynced')}
              </small>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
              style={{ marginLeft: '10px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}