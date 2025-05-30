import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { NotesContext } from '../context/NotesContext';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';

export default function NoteEditor({ noteId }) {
  const { notes, updateNote } = useContext(NotesContext);

  const note = useMemo(() => {
    return notes.find((n) => n.id === noteId) || {};
  }, [notes, noteId]);

  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  const [selectedTab, setSelectedTab] = useState('write');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await updateNote(noteId, { title, content });
    setTimeout(() => setIsSaving(false), 1000);
  }, [noteId, title, content, updateNote]);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSave();
    }, 500);
    return () => clearTimeout(handler);
  }, [title, content, handleSave]);

  useEffect(() => {
    setTitle(note.title || '');
    setContent(note.content || '');
  }, [note]);

  return (
    <div className="note-editor">
      <div className="note-editor-header">
        <input
          type="text"
          value={title}
          placeholder="Note Title"
          onChange={(e) => setTitle(e.target.value)}
          className="note-title-input"
        />
        <button
          onClick={handleSave}
          className={`save-button ${isSaving ? 'saving' : ''}`}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <ReactMde
        value={content}
        onChange={setContent}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
        }
      />
    </div>
  );
}
