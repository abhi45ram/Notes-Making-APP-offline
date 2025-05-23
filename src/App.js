import React, { useState, useContext } from 'react';
import { NotesProvider, NotesContext } from './context/NotesContext';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import ConnectionStatus from './components/ConnectionStatus';
import './App.css'; 

function AppContent() {
  const { online, createNote } = useContext(NotesContext);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const handleCreateNote = async () => {
    const newNote = await createNote();
    setSelectedNoteId(newNote.id);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 My Notes</h1>
        <div className="header-actions">
          <ConnectionStatus online={online} />
          <button className="new-note-btn" onClick={handleCreateNote}>
            + New Note
          </button>
        </div>
      </header>

      <div className="app-body">
        <aside className="note-list-container">
          <NoteList onSelectNote={setSelectedNoteId} />
        </aside>
        <main className="note-editor-container">
          {selectedNoteId ? (
            <NoteEditor noteId={selectedNoteId} />
          ) : (
            <div className="empty-state">
              <p>Select or create a note to get started!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <NotesProvider>
      <AppContent />
    </NotesProvider>
  );
}