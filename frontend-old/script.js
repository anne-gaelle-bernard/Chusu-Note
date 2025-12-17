// ===== CHUSU NOTE - Script Principal =====
// Configuration API
const API_URL = 'http://localhost:3000/api';

// Variables globales
let allFruits = [];
let filteredFruits = [];
let currentPage = 1;
const itemsPerPage = 10;

// ========== AUTHENTIFICATION ==========
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth.html';
        return false;
    }
    return true;
}

function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth.html';
        throw new Error('Session expirée');
    }

    return response;
}

async function getFruits() {
    try {
        const response = await fetchAPI('/fruits');
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error('Erreur récupération fruits:', error);
        return [];
    }
}

async function saveFruit(fruitData) {
    try {
        const response = await fetchAPI('/fruits', {
            method: 'POST',
            body: JSON.stringify(fruitData)
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur sauvegarde fruit:', error);
        throw error;
    }
}

async function deleteFruit(fruitId) {
    try {
        const response = await fetchAPI(`/fruits/${fruitId}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur suppression fruit:', error);
        throw error;
    }
}

// ========== UTILITAIRES ==========
function formatDate(dateString) {
    if (!dateString) return 'Non renseigné';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function deconnexion() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth.html';
    }
}

// ========== VALIDATION FORMULAIRE ==========
function validateForm() {
    let isValid = true;
    
    const nomFruit = document.getElementById('nomFruit');
    const nomError = document.getElementById('nomFruit-error');
    if (nomFruit && nomFruit.value.trim().length < 2) {
        nomError.textContent = 'Le nom doit contenir au moins 2 caractères';
        nomFruit.classList.add('error');
        nomFruit.classList.remove('success');
        isValid = false;
    } else if (nomFruit) {
        nomError.textContent = '';
        nomFruit.classList.remove('error');
        nomFruit.classList.add('success');
    }
    
    const memo = document.getElementById('memo');
    const memoError = document.getElementById('memo-error');
    if (memo && memo.value.trim().length < 10) {
        memoError.textContent = 'Le mémo doit contenir au moins 10 caractères';
        memo.classList.add('error');
        memo.classList.remove('success');
        isValid = false;
    } else if (memo) {
        memoError.textContent = '';
        memo.classList.remove('error');
        memo.classList.add('success');
    }
    
    return isValid;
}

// ========== MODE SOMBRE ==========
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const btn = document.querySelector('.btn-theme');
    if (btn) btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtn = document.querySelector('.btn-theme');
    if (themeBtn) {
        themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

// ========== STATISTIQUES ==========
async function showDashboard() {
    allFruits = await getFruits();
    const modal = document.getElementById('dashboardModal');
    const container = document.getElementById('statsContainer');
    
    const stats = calculateStats(allFruits);
    
    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Total fruits</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.tt}</div>
                <div class="stat-label">TT</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.nonTT}</div>
                <div class="stat-label">Non TT</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.pending}</div>
                <div class="stat-label">En attente</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.event}</div>
                <div class="stat-label">Events</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.autre}</div>
                <div class="stat-label">Autres</div>
            </div>
        </div>
        
        <div class="chart-container">
            <h3>📊 Répartition par étape</h3>
            <div style="margin: 20px 0;">
                <div style="margin: 10px 0;">
                    <strong>Fruits avec ChatGui uniquement:</strong> ${stats.chatGuiOnly}
                    <div style="background: #FFD700; height: 30px; width: ${stats.total > 0 ? (stats.chatGuiOnly/stats.total*100) : 0}%; border-radius: 5px; display: inline-block; margin-left: 10px;"></div>
                </div>
                <div style="margin: 10px 0;">
                    <strong>Fruits avec Manam (en attente résultat):</strong> ${stats.manamPending}
                    <div style="background: #FFA000; height: 30px; width: ${stats.total > 0 ? (stats.manamPending/stats.total*100) : 0}%; border-radius: 5px; display: inline-block; margin-left: 10px;"></div>
                </div>
                <div style="margin: 10px 0;">
                    <strong>Fruits TT:</strong> ${stats.tt}
                    <div style="background: #4CAF50; height: 30px; width: ${stats.total > 0 ? (stats.tt/stats.total*100) : 0}%; border-radius: 5px; display: inline-block; margin-left: 10px;"></div>
                </div>
                <div style="margin: 10px 0;">
                    <strong>Fruits Non TT:</strong> ${stats.nonTT}
                    <div style="background: #f44336; height: 30px; width: ${stats.total > 0 ? (stats.nonTT/stats.total*100) : 0}%; border-radius: 5px; display: inline-block; margin-left: 10px;"></div>
                </div>
            </div>
        </div>
        
        <div class="chart-container">
            <h3>🔔 Prochains reminders</h3>
            <div id="upcomingReminders"></div>
        </div>
    `;
    
    displayUpcomingReminders(allFruits);
    modal.style.display = 'block';
}

function calculateStats(fruits) {
    return {
        total: fruits.length,
        tt: fruits.filter(f => f.resultatManam === 'TT').length,
        nonTT: fruits.filter(f => f.resultatManam === 'Non').length,
        pending: fruits.filter(f => !f.resultatManam && f.dateManam).length,
        chatGuiOnly: fruits.filter(f => !f.dateManam).length,
        manamPending: fruits.filter(f => f.dateManam && !f.resultatManam).length,
        event: fruits.filter(f => f.typeChatGui === 'event').length,
        autre: fruits.filter(f => f.typeChatGui === 'autre').length
    };
}

function displayUpcomingReminders(fruits) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcoming = fruits
        .filter(f => f.dateReminder && new Date(f.dateReminder) >= today)
        .sort((a, b) => new Date(a.dateReminder) - new Date(b.dateReminder))
        .slice(0, 5);
    
    const container = document.getElementById('upcomingReminders');
    
    if (upcoming.length === 0) {
        container.innerHTML = '<p>Aucun reminder à venir</p>';
        return;
    }
    
    container.innerHTML = upcoming.map(fruit => {
        const daysUntil = Math.ceil((new Date(fruit.dateReminder) - today) / (1000 * 60 * 60 * 24));
        return `
            <div style="padding: 10px; margin: 5px 0; background: var(--light-yellow); border-radius: 6px;">
                <strong>${fruit.nomFruit}</strong> - ${formatDate(fruit.dateReminder)} (${daysUntil} jour(s))
            </div>
        `;
    }).join('');
}

// ========== CALENDRIER & REMINDERS ==========
function showCalendar() {
    const modal = document.getElementById('calendarModal');
    const container = document.getElementById('calendarContainer');
    
    container.innerHTML = `
        <div class="reminder-list" id="remindersList"></div>
    `;
    
    displayReminders();
    modal.style.display = 'block';
}

async function displayReminders() {
    const fruits = await getFruits();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const fruitsWithReminders = fruits
        .filter(f => f.dateReminder)
        .map(f => ({
            ...f,
            reminderDate: new Date(f.dateReminder),
            daysUntil: Math.ceil((new Date(f.dateReminder) - today) / (1000 * 60 * 60 * 24))
        }))
        .sort((a, b) => a.reminderDate - b.reminderDate);
    
    const container = document.getElementById('remindersList');
    
    if (fruitsWithReminders.length === 0) {
        container.innerHTML = '<p class="empty-state">Aucun reminder programmé 📅</p>';
        return;
    }
    
    container.innerHTML = fruitsWithReminders.map(fruit => {
        const isUrgent = fruit.daysUntil <= 3 && fruit.daysUntil >= 0;
        const isPast = fruit.daysUntil < 0;
        const urgentClass = isUrgent || isPast ? 'urgent' : '';
        
        return `
            <div class="reminder-item ${urgentClass}">
                <h4>🍊 ${fruit.nomFruit}</h4>
                <p><strong>Date:</strong> ${formatDate(fruit.dateReminder)}</p>
                <p><strong>${isPast ? '⚠️ RETARD' : isUrgent ? '🔥 URGENT' : '📅'} ${Math.abs(fruit.daysUntil)} jour(s)</strong></p>
                <p>${fruit.memo.substring(0, 100)}...</p>
                ${fruit.priere ? `<p><em>🙏 ${fruit.priere.substring(0, 80)}...</em></p>` : ''}
                <button onclick="contactFruit('${fruit._id}')" class="btn btn-primary" style="width: auto; margin-top: 10px;">
                    Reprendre contact 📞
                </button>
            </div>
        `;
    }).join('');
}

function contactFruit(fruitId) {
    alert('✉️ Fonctionnalité à venir : Envoyer un message/notification pour reprendre contact !');
    closeModal('calendarModal');
}

// ========== EXPORT ==========
function exportData() {
    const format = confirm('Voulez-vous exporter en CSV ?\n\nOK = CSV\nAnnuler = Voir les options');
    if (format) {
        exportToCSV();
    } else {
        showExportOptions();
    }
}

async function exportToCSV() {
    const fruits = await getFruits();
    
    const headers = ['Nom', 'Type', 'Date ChatGui', 'Date Manam', 'Résultat', 'Mémo', 'Prière', 'Date Reminder'];
    const rows = fruits.map(f => [
        f.nomFruit,
        f.typeChatGui,
        formatDate(f.dateChatGui),
        formatDate(f.dateManam),
        f.resultatManam || 'En attente',
        `"${f.memo.replace(/"/g, '""')}"`,
        f.priere ? `"${f.priere.replace(/"/g, '""')}"` : '',
        f.dateReminder ? formatDate(f.dateReminder) : ''
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `chusu-note-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    alert('✅ Export CSV réussi !');
}

function showExportOptions() {
    alert('📄 Export PDF à venir !\nPour l\'instant, utilisez le CSV disponible.');
    exportToCSV();
}

// ========== PAGINATION & RECHERCHE ==========
async function afficherFruits(filtre = 'all', statusFilter = 'all', sortBy = 'recent', searchTerm = '') {
    allFruits = await getFruits();
    
    // Appliquer les filtres
    filteredFruits = allFruits.filter(fruit => {
        const typeMatch = filtre === 'all' || fruit.typeChatGui === filtre;
        
        let statusMatch = true;
        if (statusFilter === 'TT') statusMatch = fruit.resultatManam === 'TT';
        else if (statusFilter === 'Non') statusMatch = fruit.resultatManam === 'Non';
        else if (statusFilter === 'pending') statusMatch = !fruit.resultatManam;
        
        const searchMatch = searchTerm === '' || 
            fruit.nomFruit.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fruit.memo.toLowerCase().includes(searchTerm.toLowerCase());
        
        return typeMatch && statusMatch && searchMatch;
    });
    
    // Tri
    switch(sortBy) {
        case 'recent':
            filteredFruits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            filteredFruits.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'name':
            filteredFruits.sort((a, b) => a.nomFruit.localeCompare(b.nomFruit));
            break;
        case 'chatgui':
            filteredFruits.sort((a, b) => new Date(b.dateChatGui) - new Date(a.dateChatGui));
            break;
    }
    
    displayPage(currentPage);
}

function displayPage(page) {
    const fruitsList = document.getElementById('fruitsList');
    const totalPages = Math.ceil(filteredFruits.length / itemsPerPage);
    
    if (filteredFruits.length === 0) {
        fruitsList.innerHTML = '<p class="empty-state">Aucun fruit trouvé 🍎</p>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageFruits = filteredFruits.slice(start, end);
    
    fruitsList.innerHTML = pageFruits.map(fruit => `
        <div class="fruit-card">
            <div class="fruit-card-header">
                <h3 class="fruit-name">🍊 ${fruit.nomFruit}</h3>
                <span class="fruit-type">${fruit.typeChatGui}</span>
            </div>

            <div class="fruit-memo">
                <strong>Mémo:</strong><br>
                ${fruit.memo}
            </div>

            ${fruit.priere ? `
                <div class="fruit-memo" style="background: #FFF9E6; border-left: 4px solid #FFD700;">
                    <strong>🙏 Prière:</strong><br>
                    ${fruit.priere}
                </div>
            ` : ''}

            <div class="fruit-details">
                <div class="detail-item">
                    <span class="detail-label">Date ChatGui:</span>
                    <span class="detail-value">${formatDate(fruit.dateChatGui)}</span>
                </div>

                <div class="detail-item">
                    <span class="detail-label">Date Manam:</span>
                    <span class="detail-value">${formatDate(fruit.dateManam)}</span>
                </div>

                ${fruit.dateReminder ? `
                    <div class="detail-item">
                        <span class="detail-label">🔔 Reminder:</span>
                        <span class="detail-value">${formatDate(fruit.dateReminder)}</span>
                    </div>
                ` : ''}

                ${fruit.resultatManam ? `
                    <div class="detail-item">
                        <span class="detail-label">Résultat Manam:</span>
                        <span class="detail-value ${fruit.resultatManam === 'TT' ? 'result-tt' : 'result-non'}">
                            ${fruit.resultatManam}
                        </span>
                    </div>
                ` : ''}

                ${fruit.raison ? `
                    <div class="detail-item">
                        <span class="detail-label">Raison:</span>
                        <span class="detail-value">${fruit.raison}</span>
                    </div>
                ` : ''}
            </div>

            <button class="btn btn-danger" onclick="supprimerFruit('${fruit._id}')">
                Supprimer 🗑️
            </button>
        </div>
    `).join('');
    
    displayPagination(page, totalPages);
}

function displayPagination(currentPage, totalPages) {
    const container = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    html += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>◀ Précédent</button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span>...</span>';
        }
    }
    
    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Suivant ▶</button>`;
    
    container.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    displayPage(page);
    document.querySelector('.list-section').scrollIntoView({ behavior: 'smooth' });
}

async function supprimerFruit(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fruit ?')) {
        try {
            await deleteFruit(id);
            currentPage = 1;
            const filterType = document.getElementById('filterType');
            const filterStatus = document.getElementById('filterStatus');
            const sortBy = document.getElementById('sortBy');
            const searchInput = document.getElementById('searchInput');
            await afficherFruits(
                filterType ? filterType.value : 'all',
                filterStatus ? filterStatus.value : 'all',
                sortBy ? sortBy.value : 'recent',
                searchInput ? searchInput.value : ''
            );
            alert('✅ Fruit supprimé avec succès !');
        } catch (error) {
            alert('❌ Erreur lors de la suppression du fruit.');
        }
    }
}

// ========== MODALS ==========
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// ========== NOTIFICATIONS URGENTES ==========
async function checkUrgentReminders() {
    const fruits = await getFruits();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const urgentReminders = fruits.filter(f => {
        if (!f.dateReminder) return false;
        const reminderDate = new Date(f.dateReminder);
        const daysUntil = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));
        return daysUntil >= 0 && daysUntil <= 2;
    });
    
    if (urgentReminders.length > 0) {
        setTimeout(() => {
            const message = urgentReminders.length === 1 
                ? `🔔 Vous avez 1 reminder urgent : ${urgentReminders[0].nomFruit}`
                : `🔔 Vous avez ${urgentReminders.length} reminders urgents !`;
            
            if (confirm(message + '\n\nVoulez-vous voir le calendrier ?')) {
                showCalendar();
            }
        }, 1000);
    }
}

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;

    loadTheme();

    const user = getUser();
    if (user) {
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) subtitle.textContent = `Bienvenue ${user.username} ! 👋`;
    }

    // Gestion du formulaire
    const resultatManamSelect = document.getElementById('resultatManam');
    const raisonGroup = document.getElementById('raisonGroup');

    if (resultatManamSelect) {
        resultatManamSelect.addEventListener('change', function() {
            if (this.value === 'Non') {
                raisonGroup.style.display = 'block';
            } else {
                raisonGroup.style.display = 'none';
                document.getElementById('raison').value = '';
            }
        });
    }

    const fruitForm = document.getElementById('fruitForm');
    if (fruitForm) {
        fruitForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }

            const nouveauFruit = {
                nomFruit: document.getElementById('nomFruit').value.trim(),
                memo: document.getElementById('memo').value.trim(),
                priere: document.getElementById('priere').value.trim(),
                dateChatGui: document.getElementById('dateChatGui').value,
                typeChatGui: document.getElementById('typeChatGui').value,
                dateManam: document.getElementById('dateManam').value,
                dateReminder: document.getElementById('dateReminder').value,
                resultatManam: document.getElementById('resultatManam').value,
                raison: document.getElementById('raison').value.trim()
            };

            try {
                await saveFruit(nouveauFruit);

                fruitForm.reset();
                raisonGroup.style.display = 'none';
                document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
                document.querySelectorAll('.success').forEach(el => el.classList.remove('success'));
                document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

                currentPage = 1;
                await afficherFruits();

                document.querySelector('.list-section').scrollIntoView({ behavior: 'smooth' });
                alert('✅ Fruit ajouté avec succès !');
            } catch (error) {
                alert('❌ Erreur lors de l\'ajout du fruit.');
            }
        });
    }

    // Filtres et recherche
    const filterType = document.getElementById('filterType');
    const filterStatus = document.getElementById('filterStatus');
    const sortBy = document.getElementById('sortBy');
    const searchInput = document.getElementById('searchInput');

    if (filterType) {
        filterType.addEventListener('change', function() {
            currentPage = 1;
            afficherFruits(this.value, filterStatus.value, sortBy.value, searchInput.value);
        });
    }

    if (filterStatus) {
        filterStatus.addEventListener('change', function() {
            currentPage = 1;
            afficherFruits(filterType.value, this.value, sortBy.value, searchInput.value);
        });
    }

    if (sortBy) {
        sortBy.addEventListener('change', function() {
            currentPage = 1;
            afficherFruits(filterType.value, filterStatus.value, this.value, searchInput.value);
        });
    }

    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentPage = 1;
                afficherFruits(filterType.value, filterStatus.value, sortBy.value, this.value);
            }, 300);
        });
    }

    // Validation en temps réel
    const nomFruitEl = document.getElementById('nomFruit');
    const memoEl = document.getElementById('memo');
    if (nomFruitEl) nomFruitEl.addEventListener('input', validateForm);
    if (memoEl) memoEl.addEventListener('input', validateForm);

    // Charger les fruits
    afficherFruits();
    
    // Vérifier les reminders urgents
    checkUrgentReminders();
});
