import api from './apiClient';

export const getCoachAdvice = async () => {
  const response = await api.get('/coach');
  return response.data;
};
