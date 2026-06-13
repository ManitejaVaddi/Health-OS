import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../api/userApi';

const ProfilePage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    retry: false,
  });
  const [form, setForm] = useState({});

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      setForm(updated);
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Unable to load profile.</div>;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-semibold text-slate-900">Your profile</h1>
      <p className="mt-2 text-slate-500">Keep your personal goals and metrics up to date.</p>

      <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        {[
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'email', label: 'Email', type: 'email', disabled: true },
          { key: 'age', label: 'Age', type: 'number' },
          { key: 'gender', label: 'Gender', type: 'text' },
          { key: 'height_cm', label: 'Height (cm)', type: 'number' },
          { key: 'weight_kg', label: 'Weight (kg)', type: 'number' },
          { key: 'goal', label: 'Goal', type: 'text' },
        ].map(({ key, label, type, disabled }) => (
          <label key={key} className="block">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input
              type={type}
              name={key}
              value={form[key] ?? ''}
              onChange={handleChange}
              disabled={disabled}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </label>
        ))}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-white transition hover:bg-brand-600 disabled:opacity-70"
          >
            {mutation.isPending ? 'Saving...' : 'Save profile'}
          </button>
        </div>
        {mutation.isError && (
          <p className="md:col-span-2 rounded-2xl bg-red-50 p-3 text-sm text-red-700">Unable to update profile.</p>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
