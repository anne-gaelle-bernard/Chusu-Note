import '../styles/StatsModal.css';

function StatsModal({ fruits, onClose }) {
  const stats = {
    total: fruits.length,
    tt: fruits.filter(f => f.resultatManam === 'TT').length,
    non: fruits.filter(f => f.resultatManam === 'Non').length,
    pending: fruits.filter(f => !f.resultatManam).length,
    event: fruits.filter(f => f.typeChatGui === 'event').length,
    autre: fruits.filter(f => f.typeChatGui === 'autre').length
  };

  const successRate = stats.total > 0 
    ? ((stats.tt / (stats.tt + stats.non || 1)) * 100).toFixed(1)
    : 0;

  // Calculer les statistiques par mois
  const getMonthlyStats = () => {
    const monthlyData = {};
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    fruits.forEach(fruit => {
      const date = new Date(fruit.dateChatgui);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthLabel = `${months[date.getMonth()]} ${date.getFullYear()}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          label: monthLabel,
          date: date,
          tt: 0,
          non: 0,
          pending: 0,
          total: 0
        };
      }
      
      monthlyData[monthKey].total++;
      if (fruit.resultatManam === 'TT') {
        monthlyData[monthKey].tt++;
      } else if (fruit.resultatManam === 'Non') {
        monthlyData[monthKey].non++;
      } else {
        monthlyData[monthKey].pending++;
      }
    });

    // Trier par date et prendre les 12 derniers mois
    return Object.values(monthlyData)
      .sort((a, b) => a.date - b.date)
      .slice(-12);
  };

  const monthlyStats = getMonthlyStats();
  const maxMonthlyValue = Math.max(...monthlyStats.map(m => m.total), 1);

  return (
    <div className="stats-page">
      <div className="stats-container">

        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">🍊</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Fruits</div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.tt}</div>
            <div className="stat-label">TT</div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">❌</div>
            <div className="stat-value">{stats.non}</div>
            <div className="stat-label">Non</div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">En attente</div>
          </div>
        </div>

        <div className="stats-section monthly-chart">
          <h3>📊 Évolution mensuelle des fruits</h3>
          <div className="month-chart-container">
            {monthlyStats.length > 0 ? (
              <div className="month-bars">
                {monthlyStats.map((month, index) => (
                  <div key={index} className="month-column">
                    <div className="month-bar-stack">
                      <div 
                        className="month-bar-segment tt-segment"
                        style={{ height: `${(month.tt / maxMonthlyValue) * 200}px` }}
                        title={`TT: ${month.tt}`}
                      >
                        {month.tt > 0 && <span className="segment-value">{month.tt}</span>}
                      </div>
                      <div 
                        className="month-bar-segment non-segment"
                        style={{ height: `${(month.non / maxMonthlyValue) * 200}px` }}
                        title={`Non: ${month.non}`}
                      >
                        {month.non > 0 && <span className="segment-value">{month.non}</span>}
                      </div>
                      <div 
                        className="month-bar-segment pending-segment"
                        style={{ height: `${(month.pending / maxMonthlyValue) * 200}px` }}
                        title={`En attente: ${month.pending}`}
                      >
                        {month.pending > 0 && <span className="segment-value">{month.pending}</span>}
                      </div>
                    </div>
                    <div className="month-label">{month.label}</div>
                    <div className="month-total">{month.total}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Aucune donnée disponible</p>
            )}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color tt-color"></div>
              <span>TT</span>
            </div>
            <div className="legend-item">
              <div className="legend-color non-color"></div>
              <span>Non</span>
            </div>
            <div className="legend-item">
              <div className="legend-color pending-color"></div>
              <span>En attente</span>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h3>Par type</h3>
          <div className="chart-bars">
            <div className="chart-bar">
              <div className="bar-label">Event</div>
              <div className="bar-container">
                <div 
                  className="bar-fill event" 
                  style={{ width: `${stats.total > 0 ? (stats.event / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="bar-value">{stats.event}</div>
            </div>
            <div className="chart-bar">
              <div className="bar-label">Autre</div>
              <div className="bar-container">
                <div 
                  className="bar-fill autre" 
                  style={{ width: `${stats.total > 0 ? (stats.autre / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="bar-value">{stats.autre}</div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h3>Taux de réussite</h3>
          <div className="success-rate">
            <div className="rate-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="rate-bg" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  className="rate-progress"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 45}`,
                    strokeDashoffset: `${2 * Math.PI * 45 * (1 - successRate / 100)}`
                  }}
                />
              </svg>
              <div className="rate-text">{successRate}%</div>
            </div>
            <p className="rate-description">
              {stats.tt} TT sur {stats.tt + stats.non} résultats
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsModal;
