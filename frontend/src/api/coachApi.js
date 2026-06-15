import api from './apiClient';

export const getCoachAdvice = async () => {
  const response = await api.get('/coach');
  return response.data;
};

export const askCoach = async (question) => {
  const response = await api.post(
    '/coach/chat',
    {
      question,
    }
  );

  return response.data;
};