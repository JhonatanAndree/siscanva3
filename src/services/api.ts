import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Cambia esto a la URL de tu API en producción

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username: string, password: string) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const getClients = async () => {
  const response = await api.get('/clients');
  return response.data;
};

export const getClient = async (id: number) => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};

export const createClient = async (clientData: any) => {
  const response = await api.post('/clients', clientData);
  return response.data;
};

export const updateClient = async (id: number, clientData: any) => {
  const response = await api.put(`/clients/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id: number) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
};

export const getDashboardData = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export default api;