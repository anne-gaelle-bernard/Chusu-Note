import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import FruitForm from './FruitForm';
import FruitList from './FruitList';
import StatsModal from './StatsModal';
import CalendarModal from './CalendarModal';
import Profile from './Profile';
import Introspection from './Introspection';
import '../styles/Dashboard.css';

function Dashboard({ onLogout }) {
  const [fruits, setFruits] = useState([]);
  const [filteredFruits, setFilteredFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [sortBy, setSortBy] = useState('recent');
  const [activeSection, setActiveSection] = useState('liste');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    loadUser();
    loadFruits();
    checkUrgentReminders();
    
    const interval = setInterval(checkUrgentReminders, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Gestion responsive de la sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Initialiser l'état de la sidebar selon la taille de l'écran
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Erreur de chargement utilisateur:', error);
    }
  };

  useEffect(() => {
    filterAndSortFruits();
  }, [fruits, searchTerm, filterType, filterStatus, sortBy]);

  const loadFruits = async () => {
    try {
      const response = await fetch(`${API_URL}/api/fruits`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Erreur de chargement');
      const data = await response.json();
      setFruits(data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de chargement des fruits');
    } finally {
      setLoading(false);
    }
  };

  const checkUrgentReminders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reminders/urgent`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const urgentReminders = await response.json();
        if (urgentReminders.length > 0) {
          alert(`🔔 ${urgentReminders.length} rappel(s) urgent(s) !`);
        }
      }
    } catch (error) {
      console.error('Erreur rappels urgents:', error);
    }
  };

  const filterAndSortFruits = () => {
    let filtered = [...fruits];

    if (searchTerm) {
      filtered = filtered.filter(f =>
        f.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.memo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'tous') {
      filtered = filtered.filter(f => f.typeChatGui === filterType);
    }

    if (filterStatus !== 'tous') {
      if (filterStatus === 'pending') {
        filtered = filtered.filter(f => !f.resultatManam);
      } else {
        filtered = filtered.filter(f => f.resultatManam === filterStatus);
      }
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.nom.localeCompare(b.nom);
        case 'chatgui':
          return new Date(b.dateChatgui) - new Date(a.dateChatgui);
        default:
          return 0;
      }
    });

    setFilteredFruits(filtered);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const exportToCSV = () => {
    const headers = ['Nom', 'Mémo', 'Prière', 'Date ChatGui', 'Type', 'Date Manam', 'Résultat', 'Raison', 'Rappel'];
    const rows = fruits.map(f => [
      f.nom,
      f.memo,
      f.priere,
      new Date(f.dateChatgui).toLocaleDateString('fr-FR'),
      f.typeChatGui,
      f.dateManam ? new Date(f.dateManam).toLocaleDateString('fr-FR') : '',
      f.resultatManam || '',
      f.raisonManam || '',
      f.dateReminder ? new Date(f.dateReminder).toLocaleDateString('fr-FR') : ''
    ]);

    const csv = [headers, ...rows].map(row =>
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `chusu_note_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = async () => {
    try {
      const response = await fetch(`${API_URL}/api/fruits/export/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors de l\'export PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chusu_fruits_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert('Erreur lors de l\'export PDF');
    }
  };

  const getPageTitle = () => {
    switch (activeSection) {
      case 'liste': return '📋 Liste des fruits';
      case 'ajouter': return '➕ Ajouter un fruit';
      case 'stats': return '📊 Statistiques';
      case 'calendrier': return '📅 Calendrier & Rappels';
      case 'introspection': return '📝 Introspection';
      case 'profile': return '👤 Mon Profil';
      default: return '📋 Liste des fruits';
    }
  };

  const renderContent = () => {
    if (loading && activeSection !== 'profile' && activeSection !== 'stats' && activeSection !== 'calendrier' && activeSection !== 'introspection') {
      return <div className="loading">Chargement...</div>;
    }

    switch (activeSection) {
      case 'ajouter':
        return <FruitForm onSuccess={() => { loadFruits(); setActiveSection('liste'); }} />;
      case 'stats':
        return <StatsModal fruits={fruits} onClose={null} />;
      case 'calendrier':
        return <CalendarModal fruits={fruits} onClose={null} />;
      case 'introspection':
        return <Introspection />;
      case 'profile':
        return <Profile />;
      case 'liste':
        return (
          <>
            <div className="filters-section">
              <input
                type="text"
                placeholder="🔍 Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />

              <div className="filters-row">
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
                  <option value="tous">Tous les types</option>
                  <option value="event">Event</option>
                  <option value="autre">Autre</option>
                </select>

                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
                  <option value="tous">Tous les statuts</option>
                  <option value="TT">TT</option>
                  <option value="Non">Non</option>
                  <option value="pending">En attente</option>
                </select>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                  <option value="recent">Plus récent</option>
                  <option value="oldest">Plus ancien</option>
                  <option value="name">Nom A-Z</option>
                  <option value="chatgui">Date ChatGui</option>
                </select>
              </div>
            </div>
            <FruitList fruits={filteredFruits} onUpdate={loadFruits} />
          </>
        );
      default:
        return <FruitList fruits={filteredFruits} onUpdate={loadFruits} />;
    }
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Bouton hamburger pour mobile */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay pour fermer la sidebar sur mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1>🍊 CHUSU</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar-toggle">
            {sidebarOpen ? '‹' : '›'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'liste' ? 'active' : ''}`}
            onClick={() => { setActiveSection('liste'); closeSidebar(); }}
            data-tooltip="Liste des fruits"
            title="Liste des fruits"
          >
            <span className="nav-icon">📋</span>
            {sidebarOpen && <span className="nav-text">Liste des fruits</span>}
          </button>

          <button 
            className={`nav-item ${activeSection === 'ajouter' ? 'active' : ''}`}
            onClick={() => { setActiveSection('ajouter'); closeSidebar(); }}
            data-tooltip="Ajouter un fruit"
            title="Ajouter un fruit"
          >
            <span className="nav-icon">➕</span>
            {sidebarOpen && <span className="nav-text">Ajouter un fruit</span>}
          </button>

          <button 
            className={`nav-item ${activeSection === 'stats' ? 'active' : ''}`}
            onClick={() => { setActiveSection('stats'); closeSidebar(); }}
            data-tooltip="Statistiques"
            title="Statistiques"
          >
            <span className="nav-icon">📊</span>
            {sidebarOpen && <span className="nav-text">Statistiques</span>}
          </button>

          <button 
            className={`nav-item ${activeSection === 'calendrier' ? 'active' : ''}`}
            onClick={() => { setActiveSection('calendrier'); closeSidebar(); }}
            data-tooltip="Calendrier"
            title="Calendrier"
          >
            <span className="nav-icon">📅</span>
            {sidebarOpen && <span className="nav-text">Calendrier</span>}
          </button>

          <button 
            className={`nav-item ${activeSection === 'introspection' ? 'active' : ''}`}
            onClick={() => { setActiveSection('introspection'); closeSidebar(); }}
            data-tooltip="Introspection"
            title="Introspection"
          >
            <span className="nav-icon">📝</span>
            {sidebarOpen && <span className="nav-text">Introspection</span>}
          </button>

          <button 
            className="nav-item"
            onClick={() => { exportToCSV(); closeSidebar(); }}
            data-tooltip="Exporter CSV"
            title="Exporter CSV"
          >
            <span className="nav-icon">�</span>
            {sidebarOpen && <span className="nav-text">Exporter CSV</span>}
          </button>

          <button 
            className="nav-item"
            onClick={() => { exportToPDF(); closeSidebar(); }}
            data-tooltip="Exporter PDF"
            title="Exporter PDF"
          >
            <span className="nav-icon">📄</span>
            {sidebarOpen && <span className="nav-text">Exporter PDF</span>}
          </button>

          <button 
            className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveSection('profile'); closeSidebar(); }}
            data-tooltip="Mon Profil"
            title="Mon Profil"
          >
            <span className="nav-icon">👤</span>
            {sidebarOpen && <span className="nav-text">Mon Profil</span>}
          </button>

          <button 
            className="nav-item"
            onClick={() => { toggleDarkMode(); closeSidebar(); }}
            data-tooltip={darkMode ? 'Mode clair' : 'Mode sombre'}
            title={darkMode ? 'Mode clair' : 'Mode sombre'}
          >
            <span className="nav-icon">{darkMode ? '☀️' : '🌙'}</span>
            {sidebarOpen && <span className="nav-text">{darkMode ? 'Mode clair' : 'Mode sombre'}</span>}
          </button>

          <button 
            className="nav-item logout"
            onClick={onLogout}
            data-tooltip="Déconnexion"
            title="Déconnexion"
          >
            <span className="nav-icon">🚪</span>
            {sidebarOpen && <span className="nav-text">Déconnexion</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && user && (
            <div className="user-info" onClick={() => setActiveSection('profile')} style={{ cursor: 'pointer' }}>
              <div className="user-avatar">
                {user.username?.charAt(0).toUpperCase() || '👤'}
              </div>
              <div className="user-details">
                <p className="user-name">{user.username}</p>
                <p className="user-role">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="mobile-brand">
            <span className="mobile-logo">🍊</span>
            <h1 className="mobile-title">CHUSU</h1>
          </div>
          <h2 className="page-title">
            {getPageTitle()}
          </h2>
          {activeSection !== 'profile' && (
            <div className="header-stats">
              <div className="stat-badge">
                <span className="stat-label">Total</span>
                <span className="stat-value">{fruits.length}</span>
              </div>
              <div className="stat-badge success">
                <span className="stat-label">TT</span>
                <span className="stat-value">{fruits.filter(f => f.resultatManam === 'TT').length}</span>
              </div>
            </div>
          )}
        </header>

        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
