import { useState } from 'react';
import { API_URL } from '../config';
import FruitForm from './FruitForm';
import '../styles/FruitList.css';

function FruitList({ fruits, onUpdate }) {
  const [editingFruit, setEditingFruit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(fruits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFruits = fruits.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce fruit ?')) return;

    try {
      const response = await fetch(`${API_URL}/api/fruits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erreur de suppression');

      alert('Fruit supprimé !');
      onUpdate();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (fruit) => {
    if (!fruit.resultatManam) return <span className="badge pending">En attente</span>;
    if (fruit.resultatManam === 'TT') return <span className="badge success">TT</span>;
    return <span className="badge danger">Non</span>;
  };

  const isUrgent = (dateReminder) => {
    if (!dateReminder) return false;
    const today = new Date();
    const reminder = new Date(dateReminder);
    const diffTime = reminder - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  };

  if (editingFruit) {
    return (
      <div className="editing-container">
        <FruitForm
          editingFruit={editingFruit}
          onSuccess={() => {
            setEditingFruit(null);
            onUpdate();
          }}
          onCancel={() => setEditingFruit(null)}
        />
      </div>
    );
  }

  return (
    <div className="fruit-list">
      <div className="list-header">
        <h2>📋 Liste des fruits ({fruits.length})</h2>
      </div>

      {fruits.length === 0 ? (
        <div className="empty-state">
          <p>Aucun fruit pour le moment.</p>
          <p>Ajoutez-en un avec le formulaire ci-dessus !</p>
        </div>
      ) : (
        <>
          <div className="fruits-grid">
            {currentFruits.map((fruit) => (
              <div key={fruit._id} className="fruit-card">
                <div className="card-header">
                  <h3>{fruit.nomFruit}</h3>
                  {getStatusBadge(fruit)}
                </div>

                <div className="card-body">
                  <div className="card-field">
                    <strong>Type:</strong> <span className={`type-badge ${fruit.typeChatGui}`}>{fruit.typeChatGui}</span>
                  </div>
                  <div className="card-field">
                    <strong>Mémo:</strong> <p>{fruit.memo}</p>
                  </div>
                  {fruit.priere && (
                    <div className="card-field prayer">
                      <strong>🙏 Prière:</strong> <p>{fruit.priere}</p>
                    </div>
                  )}
                  <div className="card-field">
                    <strong>Date ChatGui:</strong> {formatDate(fruit.dateChatGui)}
                  </div>
                  {fruit.dateManam && (
                    <div className="card-field">
                      <strong>Date Manam:</strong> {formatDate(fruit.dateManam)}
                    </div>
                  )}
                  {fruit.dateReminder && (
                    <div className={`card-field ${isUrgent(fruit.dateReminder) ? 'urgent' : ''}`}>
                      <strong>🔔 Rappel:</strong> {formatDate(fruit.dateReminder)}
                      {isUrgent(fruit.dateReminder) && <span className="urgent-label">URGENT</span>}
                    </div>
                  )}
                  {fruit.raison && (
                    <div className="card-field">
                      <strong>Raison:</strong> <p>{fruit.raison}</p>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button onClick={() => setEditingFruit(fruit)} className="edit-btn">
                    ✏️ Modifier
                  </button>
                  <button onClick={() => handleDelete(fruit._id)} className="delete-btn">
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                ← Précédent
              </button>
              <span className="page-info">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FruitList;
