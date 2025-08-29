import axios from 'axios';
import { toast } from 'react-toastify';

// Configuração base da API
const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token encontrado:', token ? 'Sim' : 'Não'); // Debug
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas de erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error.response?.status, error.response?.data); // Debug
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('todoUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de Autenticação
export const authService = {
  async login(credentials) {
    try {
      console.log('Fazendo login...'); // Debug
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      console.log('Login bem-sucedido, token:', token ? 'Recebido' : 'Não recebido'); // Debug
      
      // Salvar token e dados do usuário
      localStorage.setItem('token', token);
      localStorage.setItem('todoUser', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      console.error('Erro no login:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Salvar token e dados do usuário
      localStorage.setItem('token', token);
      localStorage.setItem('todoUser', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar conta');
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('todoUser');
  }
};

// Serviços de Tarefas
export const taskService = {
  async getTasks() {
    try {
      console.log('Buscando tarefas...'); // Debug
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Erro ao carregar tarefas');
    }
  },

  async createTask(taskData) {
    try {
      toast.success("Tarefa criada com sucesso")
      console.log('Criando tarefa:', taskData); // Debug
      const response = await api.post('/tasks', taskData);
      console.log('Tarefa criada:', response.data); // Debug
      return response.data;
    } catch (error) {
      toast.error("Erro ao criar tarefa")
      console.error('Erro ao criar tarefa:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Erro ao criar tarefa');
    }
  },

  async updateTask(taskId, taskData) {
    try {toast.success("Tarefa atualizada")
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
      
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar tarefa');
    }
  },

  async deleteTask(taskId) {
    try {toast.error("Tarefa deletada")
      await api.delete(`/tasks/${taskId}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao excluir tarefa');
    }
  },

  async toggleTask(taskId) {
    try {
      const response = await api.patch(`/tasks/${taskId}/toggle`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao marcar tarefa');
    }
  }
};

export default api;