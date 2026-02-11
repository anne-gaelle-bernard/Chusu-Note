import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import '../styles/Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erreur de chargement');

      const data = await response.json();
      setUser(data);
      setFormData({
        username: data.username,
        email: data.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const updateData = {
        username: formData.username,
        email: formData.email
      };

      const response = await fetch(`${API_URL}/api/auth/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setUser(data.user);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  if (loading) {
    return <div className="loading">Chargement du profil...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {user?.username?.charAt(0).toUpperCase() || '👤'}
        </div>
        <div className="profile-info">
          <h2>{user?.username}</h2>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-joined">
            Membre depuis {new Date(user?.createdAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-sections">
        {/* Section Informations */}
        <div className="profile-section">
          <div className="section-header">
            <h3>📋 Informations personnelles</h3>
            {!editing && (
              <button onClick={() => setEditing(true)} className="edit-btn-small">
                ✏️ Modifier
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  💾 Enregistrer
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      ...formData,
                      username: user.username,
                      email: user.email
                    });
                  }} 
                  className="cancel-btn"
                >
                  ❌ Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="info-display">
              <div className="info-row">
                <span className="info-label">Nom d'utilisateur:</span>
                <span className="info-value">{user?.username}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* Section Mot de passe */}
        <div className="profile-section">
          <div className="section-header">
            <h3>🔒 Changer le mot de passe</h3>
          </div>

          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Mot de passe actuel</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="••••••••"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                🔐 Changer le mot de passe
              </button>
            </div>
          </form>
        </div>

        {/* Section Statistiques */}
        <div className="profile-section">
          <div className="section-header">
            <h3>📊 Statistiques du compte</h3>
          </div>

          <div className="stats-grid-profile">
            <div className="stat-item">
              <div className="stat-icon">🍊</div>
              <div className="stat-details">
                <span className="stat-number">{user?.fruitsCount || 0}</span>
                <span className="stat-text">Fruits créés</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">✅</div>
              <div className="stat-details">
                <span className="stat-number">{user?.ttCount || 0}</span>
                <span className="stat-text">Résultats TT</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📅</div>
              <div className="stat-details">
                <span className="stat-number">{user?.remindersCount || 0}</span>
                <span className="stat-text">Rappels actifs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
