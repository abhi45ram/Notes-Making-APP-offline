import React, { createContext, useState, useEffect } from 'react';
import { db } from '../db/indexedDB';
import { syncNotesWithServer } from '../utils/syncUtils';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { v4 as uuidv4 } from 'uuid';

export const NotesContext = createContext();
const API_URL = 'http://localhost:3001/notes'; 

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const online = useOnlineStatus();

  useEffect(() => {
    async function loadNotes() {
      const allNotes = await db.notes.toArray();
      setNotes(allNotes);
    }
    loadNotes();
  }, []);

  useEffect(() => {
    if (online) {
      syncNotesWithServer().then(() => {
        db.notes.toArray().then(setNotes);
      });
    }
  }, [online]);

  // Create a new note
  const createNote = async () => {
    const newNote = {
      id: uuidv4(),
      title: 'New Note',
      content: '',
      updatedAt: new Date().toISOString(),
      synced: false,
    };
    await db.notes.add(newNote);
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  // Update a note
  const updateNote = async (id, fields) => {
    if (!id || typeof id !== 'string') {
      console.error('Invalid id on updateNote:', id);
      return;
    }
    const note = notes.find((n) => n.id === id);
    if (!note) return;
  
    const updatedNote = {
      ...note,
      ...fields,
      updatedAt: new Date().toISOString(),
      synced: false,
    };
  
    await db.notes.put(updatedNote);
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? updatedNote : n))
    );
  };
  

  // Delete a note
  const deleteNote = async (id) => {
    await db.notes.delete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (online) {
      fetch(`${API_URL}/${id}`, { method: 'DELETE' }).catch((err) => {
        console.error('Delete on server failed', err);
      });
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        createNote,
        updateNote,
        deleteNote,
        online,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
