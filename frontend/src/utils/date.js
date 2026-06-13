export const getToday = () => new Date().toISOString().slice(0, 10);

export const formatShortDate = (value) => {
  if (!value) return 'Today';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
};
