import api from './apiClient';

export const submitFeedback =
  async (data) => {
    const response =
      await api.post(
        '/feedback',
        data
      );

    return response.data;
  };

export const getFeedbacks =
  async () => {
    const response =
      await api.get('/feedback');

    return response.data;
  };
  export const reviewFeedback = async (
  id
) => {
  const response = await api.put(
    `/feedback/${id}/review`
  );

  return response.data;
};

export const getMyFeedbacks =
  async () => {
    const response =
      await api.get(
        '/feedback/my-feedbacks'
      );

    return response.data;
  };