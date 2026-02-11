import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import '../styles/Introspection.css';

function Introspection() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const saveNote = async () => {
    if (!title.trim() || !currentNote.trim()) {
      alert('Le titre et le contenu sont requis');
      return;
    }

    try {
      const url = isEditing ? `${API_URL}/api/notes/${editingId}` : `${API_URL}/api/notes`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, content: currentNote })
      });

      if (response.ok) {
        await loadNotes();
        resetForm();
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const deleteNote = async (id) => {
    if (!confirm('Supprimer cette note ?')) return;

    try {
      const response = await fetch(`${API_URL}/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await loadNotes();
        if (editingId === id) {
          resetForm();
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const editNote = (note) => {
    setTitle(note.title);
    setCurrentNote(note.content);
    setIsEditing(true);
    setEditingId(note._id);
  };

  const resetForm = () => {
    setTitle('');
    setCurrentNote('');
    setIsEditing(false);
    setEditingId(null);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="introspection-container">
      <div className="introspection-header">
        <h2>📝 Introspection & Notes</h2>
        <p>Votre espace de réflexion personnelle</p>
      </div>

      <div className="introspection-content">
        <div className="note-editor">
          <div className="editor-header">
            <h3>{isEditing ? '✏️ Modifier la note' : '➕ Nouvelle note'}</h3>
            {isEditing && (
              <button onClick={resetForm} className="cancel-edit-btn">
                ❌ Annuler
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Titre de la note..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="note-title-input"
          />

          <textarea
            placeholder="Écrivez vos pensées, réflexions, apprentissages..."
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            className="note-textarea"
            rows="12"
          />

          <div className="editor-actions">
            <button onClick={saveNote} className="save-note-btn">
              {isEditing ? '💾 Mettre à jour' : '💾 Sauvegarder'}
            </button>
            <div className="note-stats">
              {currentNote.length} caractères • {currentNote.split(/\s+/).filter(w => w).length} mots
            </div>
          </div>
        </div>

        <div className="notes-list-section">
          <div className="notes-list-header">
            <h3>📚 Mes notes ({notes.length})</h3>
            <input
              type="text"
              placeholder="🔍 Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="notes-search"
            />
          </div>

          <div className="notes-list">
            {filteredNotes.length > 0 ? (
              filteredNotes.map(note => (
                <div key={note._id} className="note-card">
                  <div className="note-card-header">
                    <h4>{note.title}</h4>
                    <span className="note-date">{formatDate(note.createdAt)}</span>
                  </div>
                  <p className="note-preview">
                    {note.content.substring(0, 150)}
                    {note.content.length > 150 && '...'}
                  </p>
                  <div className="note-card-actions">
                    <button onClick={() => editNote(note)} className="edit-note-btn">
                      ✏️ Modifier
                    </button>
                    <button onClick={() => deleteNote(note._id)} className="delete-note-btn">
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notes">
                <p>📝 Aucune note {searchTerm && 'trouvée'}</p>
                <p className="no-notes-hint">
                  {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez à écrire vos réflexions'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Introspection;
