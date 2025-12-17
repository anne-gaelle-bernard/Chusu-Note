import { useState } from 'react';
import '../styles/FruitForm.css';

function FruitForm({ onSuccess, editingFruit, onCancel }) {
  const [formData, setFormData] = useState(editingFruit || {
    nomFruit: '',
    memo: '',
    priere: '',
    dateChatGui: '',
    typeChatGui: 'event',
    dateManam: '',
    dateReminder: '',
    resultatManam: '',
    raison: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomFruit.trim()) {
      newErrors.nomFruit = 'Le nom du fruit est requis';
    } else if (formData.nomFruit.length < 2) {
      newErrors.nomFruit = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.memo.trim()) {
      newErrors.memo = 'Le mémo est requis';
    } else if (formData.memo.length < 5) {
      newErrors.memo = 'Le mémo doit contenir au moins 5 caractères';
    }

    if (!formData.dateChatGui) {
      newErrors.dateChatGui = 'La date ChatGui est requise';
    }

    if (formData.dateManam && formData.dateChatGui) {
      if (new Date(formData.dateManam) < new Date(formData.dateChatGui)) {
        newErrors.dateManam = 'La date Manam doit être après la date ChatGui';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const url = editingFruit
        ? `/api/fruits/${editingFruit._id}`
        : '/api/fruits';
      
      const method = editingFruit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      alert(editingFruit ? 'Fruit modifié !' : 'Fruit ajouté !');
      setFormData({
        nomFruit: '',
        memo: '',
        priere: '',
        dateChatGui: '',
        typeChatGui: 'event',
        dateManam: '',
        dateReminder: '',
        resultatManam: '',
        raison: ''
      });
      onSuccess();
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fruit-form">
      <h2>{editingFruit ? '✏️ Modifier' : '➕ Ajouter un fruit'}</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nomFruit">Nom du fruit *</label>
          <input
            type="text"
            id="nomFruit"
            name="nomFruit"
            value={formData.nomFruit}
            onChange={handleChange}
            className={errors.nomFruit ? 'error' : ''}
            placeholder="Ex: Jean Dupont"
          />
          {errors.nomFruit && <span className="error-text">{errors.nomFruit}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="typeChatGui">Type de ChatGui *</label>
          <select
            id="typeChatGui"
            name="typeChatGui"
            value={formData.typeChatGui}
            onChange={handleChange}
          >
            <option value="event">Event</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="memo">Mémo *</label>
        <textarea
          id="memo"
          name="memo"
          value={formData.memo}
          onChange={handleChange}
          className={errors.memo ? 'error' : ''}
          placeholder="Notes importantes..."
          rows="3"
        />
        {errors.memo && <span className="error-text">{errors.memo}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="priere">Prière</label>
        <textarea
          id="priere"
          name="priere"
          value={formData.priere}
          onChange={handleChange}
          placeholder="Intentions de prière..."
          rows="2"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dateChatGui">Date ChatGui *</label>
          <input
            type="date"
            id="dateChatGui"
            name="dateChatGui"
            value={formData.dateChatGui}
            onChange={handleChange}
            className={errors.dateChatGui ? 'error' : ''}
          />
          {errors.dateChatGui && <span className="error-text">{errors.dateChatGui}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="dateManam">Date Manam</label>
          <input
            type="date"
            id="dateManam"
            name="dateManam"
            value={formData.dateManam}
            onChange={handleChange}
            className={errors.dateManam ? 'error' : ''}
          />
          {errors.dateManam && <span className="error-text">{errors.dateManam}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dateReminder">Date de rappel</label>
          <input
            type="date"
            id="dateReminder"
            name="dateReminder"
            value={formData.dateReminder}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="resultatManam">Résultat Manam</label>
          <select
            id="resultatManam"
            name="resultatManam"
            value={formData.resultatManam}
            onChange={handleChange}
          >
            <option value="">En attente</option>
            <option value="TT">TT</option>
            <option value="Non">Non</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="raison">Raison</label>
        <textarea
          id="raison"
          name="raison"
          value={formData.raison}
          onChange={handleChange}
          placeholder="Détails supplémentaires..."
          rows="2"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {editingFruit ? 'Modifier' : 'Ajouter'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

export default FruitForm;
