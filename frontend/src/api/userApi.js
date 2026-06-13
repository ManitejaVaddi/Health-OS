import api from './apiClient';

export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const getDashboard = async (date) => {
  const response = await api.get('/dashboard', { params: date ? { date } : {} });
  return response.data;
};

export const searchFood = async (query) => {
  const response = await api.get('/food/search', { params: { query } });
  return response.data;
};

export const getMeals = async (date) => {
  const response = await api.get('/meals', { params: date ? { date } : {} });
  return response.data;
};

export const getExercises = async (date) => {
  const response = await api.get('/exercises', { params: date ? { date } : {} });
  return response.data;
};

export const getWaterLogs = async (date) => {
  const response = await api.get('/waters', { params: date ? { date } : {} });
  return response.data;
};

export const getWeightHistory = async () => {
  const response = await api.get('/weights');
  return response.data;
};

export const getHealthScore = async (date) => {
  const response = await api.get('/health-score', { params: date ? { date } : {} });
  return response.data;
};

export const getHealthScoreHistory = async (limit = 30) => {
  const response = await api.get('/health-scores', { params: { limit } });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/users/history');
  return response.data;
};

export const addMeal = async (mealData) => {
  const response = await api.post('/meals', mealData);
  return response.data;
};

export const addExercise = async (exerciseData) => {
  const response = await api.post('/exercises', exerciseData);
  return response.data;
};

export const addWater = async (waterData) => {
  const response = await api.post('/water', waterData);
  return response.data;
};

export const addWeight = async (weightData) => {
  const response = await api.post('/weight', weightData);
  return response.data;
};
