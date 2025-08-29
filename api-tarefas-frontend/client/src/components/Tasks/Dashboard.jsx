import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskService, authService } from '../../services/api';
import { useNavigate } from 'react-router'


const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingTask, setAddingTask] = useState(false);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editingText, setEditingText] = useState('');
  const navigate = useNavigate()




  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await taskService.getTasks();
      setTasks(tasksData);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      setAddingTask(true);
      const task = await taskService.createTask({ 
        title: newTask,
      });
      setTasks([...tasks, task]);
      setNewTask('');
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingTask(false);
    }
  };

  const toggleTask = async (id) => {
    try {
      console.log('Tentando marcar tarefa:', id); // Debug
      const updatedTask = await taskService.toggleTask(id);
      console.log('Tarefa atualizada:', updatedTask); // Debug
      setTasks(tasks.map(task => 
        task.id === id ? updatedTask : task
      ));
      setError('');
    } catch (err) {
      console.error('Erro ao marcar tarefa:', err); // Debug
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      console.log('Tentando excluir tarefa:', id); // Debug
      await taskService.deleteTask(id);
      console.log('Tarefa excluída com sucesso'); // Debug
      setTasks(tasks.filter(task => task.id !== id));
      setError('');
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err); // Debug
      setError(err.message);
    }
  };

  const handleLogout = () => {
    authService.logout();
    onLogout?.();
    navigate("/login")
  };
  
  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditingText(task.title);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditingText('');
  };

  const saveTask = async (id) => {
    if (!editingText.trim()) return;

    try {
      const updatedTask = await taskService.updateTask(id, { title: editingText });
      setTasks(tasks.map(task => 
        task.id === id ? updatedTask : task
      ));
      setEditingTask(null);
      setEditingText('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📝 Minhas Tarefas</h1>
        <div className="user-info">
          <span>Olá, {user.username}!😊</span>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats">
        <div className="stat-card total" >
          <span className="stat-number">{totalTasks}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card concluidas">
          <span className="stat-number">{completedTasks}</span>
          <span className="stat-label">Concluídas</span>
        </div>
        <div className="stat-card pendentes">
          <span className="stat-number">{totalTasks - completedTasks}</span>
          <span className="stat-label">Pendentes</span>
        </div>
      </div>

      <form onSubmit={addTask} className="add-task-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Digite uma nova tarefa..."
          className="task-input"
          disabled={addingTask}
        />
        <button 
          type="submit" 
          className="add-task-btn"
          disabled={addingTask}
        >
          {addingTask ? '⏳' : '➕'}
        </button>
      </form>

      {loading ? (
        <div className="loading-tasks">
          <p>⏳ Carregando tarefas...</p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.length === 0 ? (
            <p className="no-tasks">Nenhuma tarefa ainda. Adicione uma acima! 👆</p>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className={`task-item ${task.completed ? 'completed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="task-checkbox"
                />
                
                {editingTask === task.id ? (
                 
                  <div className="task-edit">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="task-edit-input"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') { 
                          saveTask(task.id);
                        } else if (e.key === 'Escape') {
                          cancelEditing();
                        }
                      }}
                      autoFocus
                    />
                    <button 
                      onClick={() => saveTask(task.id)}
                      className="save-btn"
                    >
                      ✅
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="cancel-btn"
                    >
                      ❌
                    </button>
                  </div>
                ) : (
                  <>
                    <span 
                      className="task-text"
                      onDoubleClick={() => startEditing(task)}
                      title="Duplo clique para editar"
                    >
                      {task.title}
                    </span>
                    <div className="task-actions">
                      <button
                        onClick={() => startEditing(task)}
                        className="edit-btn"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;