import { useQuery } from '@tanstack/react-query';
import { getCoachAdvice } from '../api/coachApi';

const CoachPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['coachAdvice'],
    queryFn: getCoachAdvice,
    retry: false,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <div>
        <p className="text-sm text-brand-600">AI Nutrition Coach</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Personalized wellness guidance</h1>
        <p className="mt-2 text-slate-500">Get friendly nutrition tips, hydration reminders, and practical habit support.</p>
      </div>

      {isLoading ? (
        <div className="rounded-3xl bg-slate-50 p-6 text-slate-600">Loading coach advice...</div>
      ) : error ? (
        <div className="rounded-3xl bg-red-50 p-6 text-red-700">Unable to load advice at the moment.</div>
      ) : (
        <div className="rounded-3xl bg-slate-50 p-6 text-slate-700">
          <p>{data?.advice}</p>
        </div>
      )}
    </div>
  );
};

export default CoachPage;
