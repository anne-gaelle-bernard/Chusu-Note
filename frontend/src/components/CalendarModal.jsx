import { useState, useEffect } from 'react';
import '../styles/CalendarModal.css';

function CalendarModal({ fruits, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '09:00',
    priority: 'medium'
  });

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const response = await fetch('/api/reminders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReminders(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const createReminder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...reminderForm,
          date: new Date(`${reminderForm.date}T${reminderForm.time}`)
        })
      });

      if (response.ok) {
        await loadReminders();
        setShowReminderForm(false);
        setReminderForm({
          title: '',
          description: '',
          date: '',
          time: '09:00',
          priority: 'medium'
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const deleteReminder = async (id) => {
    if (!confirm('Supprimer ce rappel ?')) return;
    
    try {
      const response = await fetch(`/api/reminders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await loadReminders();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const toggleReminderStatus = async (id, completed) => {
    try {
      const response = await fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ completed: !completed })
      });

      if (response.ok) {
        await loadReminders();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift(prevDate);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const formatDateToYMD = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getRemindersForDate = (day) => {
    const dateStr = formatDateToYMD(day);
    return reminders.filter(r => {
      const reminderDate = formatDateToYMD(new Date(r.date));
      return reminderDate === dateStr && !r.completed;
    });
  };

  const getFruitsForDate = (day) => {
    const dateStr = formatDateToYMD(day);
    return fruits.filter(f => {
      const fruitDate = formatDateToYMD(new Date(f.dateChatgui));
      return fruitDate === dateStr;
    });
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setReminderForm({
      ...reminderForm,
      date: formatDateToYMD(day),
      time: '09:00'
    });
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    return reminders
      .filter(r => !r.completed && new Date(r.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#2196f3';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return '🔴 Haute';
      case 'medium': return '🟡 Moyenne';
      case 'low': return '🟢 Basse';
      default: return '🔵 Normale';
    }
  };

  const renderDay = (day) => {
    const isToday = isSameDay(day, new Date());
    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
    const hasFruits = getFruitsForDate(day).length > 0;
    const hasReminders = getRemindersForDate(day).length > 0;
    const isSelected = selectedDate && isSameDay(day, selectedDate);

    return (
      <div
        key={day.toString()}
        className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${hasFruits || hasReminders ? 'has-events' : ''} ${isSelected ? 'selected' : ''}`}
        onClick={() => handleDateClick(day)}
      >
        <span className="day-number">{day.getDate()}</span>
        {(hasFruits || hasReminders) && (
          <div className="day-indicators">
            {hasFruits && <span className="indicator fruits">🍊</span>}
            {hasReminders && <span className="indicator reminders">⏰</span>}
          </div>
        )}
      </div>
    );
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="calendar-page">
      <div className="calendar-container">
        <div className="calendar-content">
          <div className="calendar-section">
            <div className="calendar-header">
              <button onClick={prevMonth} className="month-nav">◀</button>
              <h3>{currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h3>
              <button onClick={nextMonth} className="month-nav">▶</button>
            </div>

            <div className="calendar-grid">
              <div className="weekday-header">Lun</div>
              <div className="weekday-header">Mar</div>
              <div className="weekday-header">Mer</div>
              <div className="weekday-header">Jeu</div>
              <div className="weekday-header">Ven</div>
              <div className="weekday-header">Sam</div>
              <div className="weekday-header">Dim</div>
              {getDaysInMonth().map(day => renderDay(day))}
            </div>
          </div>

          {selectedDate && (
            <div className="day-details">
              <div className="day-details-header">
                <h3>📅 {formatDate(selectedDate)}</h3>
                <button 
                  onClick={() => setShowReminderForm(!showReminderForm)}
                  className="add-reminder-btn"
                >
                  {showReminderForm ? '❌' : '➕ Rappel'}
                </button>
              </div>

              {showReminderForm && (
                <form onSubmit={createReminder} className="reminder-form">
                  <input
                    type="text"
                    placeholder="Titre du rappel"
                    value={reminderForm.title}
                    onChange={(e) => setReminderForm({...reminderForm, title: e.target.value})}
                    required
                  />
                  <textarea
                    placeholder="Description (optionnelle)"
                    value={reminderForm.description}
                    onChange={(e) => setReminderForm({...reminderForm, description: e.target.value})}
                    rows="2"
                  />
                  <div className="form-row">
                    <input
                      type="date"
                      value={reminderForm.date}
                      onChange={(e) => setReminderForm({...reminderForm, date: e.target.value})}
                      required
                    />
                    <input
                      type="time"
                      value={reminderForm.time}
                      onChange={(e) => setReminderForm({...reminderForm, time: e.target.value})}
                      required
                    />
                  </div>
                  <select
                    value={reminderForm.priority}
                    onChange={(e) => setReminderForm({...reminderForm, priority: e.target.value})}
                  >
                    <option value="low">🟢 Basse priorité</option>
                    <option value="medium">🟡 Moyenne priorité</option>
                    <option value="high">🔴 Haute priorité</option>
                  </select>
                  <button type="submit" className="submit-reminder-btn">
                    ✅ Créer le rappel
                  </button>
                </form>
              )}

              {getRemindersForDate(selectedDate).length > 0 && (
                <div className="day-reminders-section">
                  <h4>⏰ Rappels</h4>
                  {getRemindersForDate(selectedDate).map(reminder => (
                    <div 
                      key={reminder._id} 
                      className="reminder-item"
                      style={{ borderLeftColor: getPriorityColor(reminder.priority) }}
                    >
                      <div className="reminder-content">
                        <div className="reminder-header">
                          <strong>{reminder.title}</strong>
                          <span className="reminder-priority">
                            {getPriorityLabel(reminder.priority)}
                          </span>
                        </div>
                        {reminder.description && (
                          <p className="reminder-description">{reminder.description}</p>
                        )}
                        <span className="reminder-time">
                          🕐 {new Date(reminder.date).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="reminder-actions">
                        <button
                          onClick={() => toggleReminderStatus(reminder._id, reminder.completed)}
                          className="reminder-action-btn complete"
                          title="Marquer comme terminé"
                        >
                          ✅
                        </button>
                        <button
                          onClick={() => deleteReminder(reminder._id)}
                          className="reminder-action-btn delete"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {getFruitsForDate(selectedDate).length > 0 && (
                <div className="day-fruits-section">
                  <h4>🍊 Fruits</h4>
                  <div className="day-fruits-list">
                    {getFruitsForDate(selectedDate).map(fruit => (
                      <div key={fruit._id} className="day-fruit-item">
                        <span className="fruit-emoji">{fruit.icone}</span>
                        <div className="fruit-info">
                          <strong>{fruit.nom}</strong>
                          <span className={`status-tag ${fruit.resultatManam?.toLowerCase()}`}>
                            {fruit.resultatManam}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {getFruitsForDate(selectedDate).length === 0 && getRemindersForDate(selectedDate).length === 0 && (
                <p className="no-events">Aucun événement pour cette date</p>
              )}
            </div>
          )}

          <div className="upcoming-reminders">
            <h3>⏰ Prochains rappels</h3>
            {getUpcomingReminders().length > 0 ? (
              <div className="upcoming-list">
                {getUpcomingReminders().map(reminder => (
                  <div 
                    key={reminder._id} 
                    className="upcoming-reminder-item"
                    style={{ borderLeftColor: getPriorityColor(reminder.priority) }}
                  >
                    <div className="upcoming-reminder-content">
                      <strong>{reminder.title}</strong>
                      <span className="upcoming-date">
                        📅 {new Date(reminder.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <span className="upcoming-priority">
                      {getPriorityLabel(reminder.priority).split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-reminders">Aucun rappel à venir</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarModal;
