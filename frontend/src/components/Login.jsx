import { useState } from 'react';
import { API_URL } from '../config';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation côté client
    if (isRegister && formData.username.trim().length < 3) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isRegister ? `${API_URL}/api/auth/register` : `${API_URL}/api/auth/login`;
      
      // Préparer les données
      const submitData = isRegister 
        ? {
            username: formData.username.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password
          }
        : {
            email: formData.email.trim().toLowerCase(),
            password: formData.password
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      // Vérifier le type de contenu de la réponse
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Le serveur backend n\'est pas disponible. Vérifiez qu\'il est démarré.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      // Stockage du token et des infos utilisateur
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      onLogin();
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🍊 CHUSU NOTE</h1>
          <p>{isRegister ? 'Créer un compte' : 'Se connecter'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Votre nom d'utilisateur"
                minLength="3"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength="6"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Chargement...' : isRegister ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </form>

        <div className="toggle-form">
          <button onClick={() => setIsRegister(!isRegister)} className="toggle-btn">
            {isRegister ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
