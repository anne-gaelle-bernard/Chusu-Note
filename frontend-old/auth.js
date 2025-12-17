const API_URL = 'http://localhost:3000/api';

// Gestion des onglets
const tabs = document.querySelectorAll('.auth-tab');
const forms = document.querySelectorAll('.auth-form');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Retirer la classe active de tous les onglets et formulaires
        tabs.forEach(t => t.classList.remove('active'));
        forms.forEach(f => f.classList.remove('active'));

        // Ajouter la classe active à l'onglet cliqué
        tab.classList.add('active');

        // Afficher le formulaire correspondant
        const tabType = tab.dataset.tab;
        document.getElementById(`${tabType}-form`).classList.add('active');

        // Réinitialiser les messages
        hideMessages();
    });
});

// Gestion de l'inscription
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessages();

    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;

    // Vérifier que les mots de passe correspondent
    if (password !== passwordConfirm) {
        showError('Les mots de passe ne correspondent pas.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Sauvegarder le token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            showSuccess('Inscription réussie ! Redirection...');
            
            // Rediriger vers la page principale après 1 seconde
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            showError(data.message || 'Erreur lors de l\'inscription.');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Impossible de se connecter au serveur.');
    }
});

// Gestion de la connexion
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessages();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Sauvegarder le token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            showSuccess('Connexion réussie ! Redirection...');
            
            // Rediriger vers la page principale après 1 seconde
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            showError(data.message || 'Erreur lors de la connexion.');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Impossible de se connecter au serveur.');
    }
});

// Fonctions utilitaires pour afficher les messages
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

function hideMessages() {
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('success-message').style.display = 'none';
}

// Rediriger si déjà connecté
if (localStorage.getItem('token')) {
    window.location.href = '/';
}
