import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getHealthScoreHistory, getWeightHistory } from '../api/userApi';
import { formatShortDate } from '../utils/date';

const ProgressCenterPage = () => {
  const { data: scores = [], isLoading: scoresLoading } = useQuery({
    queryKey: ['health-scores', 30],
    queryFn: () => getHealthScoreHistory(30),
    retry: false,
  });
  const { data: weights = [], isLoading: weightsLoading } = useQuery({
    queryKey: ['weights'],
    queryFn: getWeightHistory,
    retry: false,
  });

  const scoreData = useMemo(
    () => scores.slice().reverse().map((item) => ({ date: formatShortDate(item.score_date), score: item.score })),
    [scores]
  );
  const weightData = useMemo(
    () => weights.slice().reverse().map((item) => ({ date: formatShortDate(item.record_date), weight: Number(item.weight_kg) })),
    [weights]
  );

  if (scoresLoading || weightsLoading) {
    return <div className="p-6 text-slate-600">Loading progress...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <p className="text-sm font-medium text-brand-700">Progress Center</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-950">Health score and weight trends</h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Health Score System</h2>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#64748B" />
                <YAxis domain={[0, 100]} stroke="#64748B" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#14B8A6" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Weight Tracking</h2>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#7C3AED" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProgressCenterPage;
