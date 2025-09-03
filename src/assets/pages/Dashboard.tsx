import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Tipos para las tareas
interface Task {
  id: string;
  title: string;
  type: 'universidad' | 'trabajo' | 'personal';
  date: string; // formato: 'YYYY-MM-DD'
  completed: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  // Estado para el formulario de nueva tarea
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'universidad' as 'universidad' | 'trabajo' | 'personal',
    date: ''
  });
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Examen de Matemáticas',
      type: 'universidad',
      date: '2025-09-05',
      completed: false
    },
    {
      id: '2',
      title: 'Reunión con cliente',
      type: 'trabajo',
      date: '2025-09-03',
      completed: false
    },
    {
      id: '3',
      title: 'Ir al gimnasio',
      type: 'personal',
      date: '2025-09-04',
      completed: true
    }
  ]);

  // Agregar nueva tarea
  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.date) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      type: newTask.type,
      date: newTask.date,
      completed: false
    };
    
    setTasks([...tasks, task]);
    setNewTask({ title: '', type: 'universidad', date: '' });
    setShowTaskForm(false);
  };

  // Cancelar formulario
  const handleCancelForm = () => {
    setNewTask({ title: '', type: 'universidad', date: '' });
    setShowTaskForm(false);
  };

  // Generar días del mes actual
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        dateStr,
        isToday: dateStr === new Date().toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  // Obtener tareas por fecha
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter(task => task.date === dateStr);
  };

  // Agrupar tareas por tipo
  const getTasksByType = () => {
    const grouped = {
      universidad: tasks.filter(t => t.type === 'universidad'),
      trabajo: tasks.filter(t => t.type === 'trabajo'),
      personal: tasks.filter(t => t.type === 'personal')
    };
    return grouped;
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Eliminar tarea
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'universidad': return '🎓';
      case 'trabajo': return '💼';
      case 'personal': return '👤';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'universidad': return '#3b82f6';
      case 'trabajo': return '#ef4444';
      case 'personal': return '#22c55e';
      default: return '#64748b';
    }
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <button 
          className="back-button"
          onClick={() => navigate('/landing')}
        >
          ← Volver
        </button>
        <h1>Ordenar mi desorden</h1>
        <div className="header-date">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
      </header>

      <div className="dashboard-layout">
        {/* Sidebar con tareas por tipo */}
        <aside className="tasks-sidebar">
          <div className="sidebar-header">
            <h2>Mis Tareas</h2>
            <button 
              className="add-task-btn"
              onClick={() => setShowTaskForm(true)}
            >
              + Nueva
            </button>
          </div>

          {Object.entries(getTasksByType()).map(([type, typeTasks]) => (
            <div key={type} className="task-group">
              <div className="task-group-header">
                <span className="task-type-icon">{getTypeIcon(type)}</span>
                <h3 style={{ color: getTypeColor(type) }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </h3>
                <span className="task-count">({typeTasks.length})</span>
              </div>

              <div className="task-list">
                {typeTasks.length === 0 ? (
                  <p className="no-tasks">Sin tareas</p>
                ) : (
                  typeTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`task-item ${task.completed ? 'completed' : ''}`}
                    >
                      <button 
                        className="delete-task-btn"
                        onClick={() => deleteTask(task.id)}
                        title="Eliminar tarea"
                      >
                        🗑️
                      </button>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="task-checkbox"
                      />
                      <div className="task-content">
                        <span className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
                          {task.title}
                        </span>
                        <span className="task-date-small">
                          📅 {new Date(task.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </aside>

        {/* Calendario principal */}
        <main className="calendar-main">
          <div className="calendar-container">
            <div className="calendar-header">
              <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            </div>

            {/* Nombres de los días */}
            <div className="calendar-weekdays">
              {dayNames.map(day => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>

            {/* Días del calendario */}
            <div className="calendar-grid">
              {getDaysInMonth().map((day, index) => {
                if (!day) {
                  return <div key={index} className="calendar-day empty"></div>;
                }

                const dayTasks = getTasksForDate(day.dateStr);
                const isSelected = selectedDate === day.dateStr;

                return (
                  <div 
                    key={day.dateStr}
                    className={`calendar-day ${day.isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(isSelected ? null : day.dateStr)}
                  >
                    <div className="day-number">{day.day}</div>
                    
                    {/* Mostrar tareas del día */}
                    {dayTasks.length > 0 && (
                      <div className="day-tasks">
                        {dayTasks.slice(0, 2).map(task => (
                          <div
                            key={task.id}
                            className={`day-task ${task.completed ? 'completed' : ''}`}
                            style={{ borderLeftColor: getTypeColor(task.type) }}
                            title={task.title}
                          >
                            <span className="task-icon">{getTypeIcon(task.type)}</span>
                            <span className="task-text">{task.title}</span>
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="day-task-more">
                            +{dayTasks.length - 2} más
                          </div>
                        )}
                      </div>
                    )}

                    {/* Indicadores de tareas (puntos) - solo como backup visual */}
                    {dayTasks.length > 0 && (
                      <div className="task-indicators">
                        {dayTasks.slice(0, 3).map(task => (
                          <div
                            key={task.id}
                            className={`task-dot ${task.completed ? 'completed' : ''}`}
                            style={{ backgroundColor: getTypeColor(task.type) }}
                            title={task.title}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="task-more">+{dayTasks.length - 3}</div>
                        )}
                      </div>
                    )}

                    {/* Vista expandida de tareas del día seleccionado */}
                    {isSelected && dayTasks.length > 0 && (
                      <div className="day-tasks-popup">
                        {dayTasks.map(task => (
                          <div key={task.id} className="popup-task">
                            <span className="popup-task-icon">{getTypeIcon(task.type)}</span>
                            <span className={`popup-task-title ${task.completed ? 'completed' : ''}`}>
                              {task.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Modal para agregar nueva tarea */}
      {showTaskForm && (
        <div className="task-modal-overlay" onClick={handleCancelForm}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="task-modal-header">
              <h3>Nueva Tarea</h3>
              <button 
                className="modal-close-btn"
                onClick={handleCancelForm}
              >
                ✕
              </button>
            </div>

            <div className="task-form">
              <div className="form-field">
                <label htmlFor="task-title">Título de la tarea</label>
                <input
                  id="task-title"
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Ej: Estudiar para el examen..."
                  maxLength={50}
                />
              </div>

              <div className="form-field">
                <label htmlFor="task-type">Categoría</label>
                <select
                  id="task-type"
                  value={newTask.type}
                  onChange={(e) => setNewTask({...newTask, type: e.target.value as 'universidad' | 'trabajo' | 'personal'})}
                >
                  <option value="universidad">🎓 Universidad</option>
                  <option value="trabajo">💼 Trabajo</option>
                  <option value="personal">👤 Personal</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="task-date">Fecha</label>
                <input
                  id="task-date"
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-actions">
                <button 
                  className="btn-cancel"
                  onClick={handleCancelForm}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-save"
                  onClick={handleAddTask}
                  disabled={!newTask.title.trim() || !newTask.date}
                >
                  Guardar Tarea
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;