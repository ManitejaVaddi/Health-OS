import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getDashboard } from '../api/userApi';
import MetricCard from '../components/dashboard/MetricCard';
import HealthScorePanel from '../components/dashboard/HealthScorePanel';
import { formatShortDate, getToday } from '../utils/date';

const DashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', selectedDate],
    queryFn: () => getDashboard(selectedDate),
    retry: false,
  });

  const weightData = useMemo(
    () =>
      data?.weightHistory?.map((item) => ({
        date: formatShortDate(item.record_date),
        weight: Number(item.weight_kg),
      })) || [],
    [data]
  );

  const nutritionData = useMemo(
    () => [
      { name: 'Calories', value: data?.totals?.calories || 0, goal: data?.goals?.calories || 0 },
      { name: 'Protein', value: data?.totals?.protein || 0, goal: data?.goals?.protein || 0 },
      { name: 'Carbs', value: data?.totals?.carbs || 0, goal: data?.goals?.carbs || 0 },
      { name: 'Fat', value: data?.totals?.fat || 0, goal: data?.goals?.fat || 0 },
      { name: 'Fiber', value: data?.totals?.fiber || 0, goal: data?.goals?.fiber || 0 },
      { name: 'Water', value: data?.waterIntakeMl || 0, goal: data?.goals?.water || 0 },
    ],
    [data]
  );

  if (isLoading) {
    return <div className="p-6 text-slate-600">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Unable to load dashboard.</div>;
  }

  const latestWeight = data?.latestWeight?.weight_kg || data?.weightHistory?.at(-1)?.weight_kg || 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-brand-700">HealthOS Dashboard</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-950">Daily health command center</h1>
        </div>
        <label className="grid gap-1 text-sm font-medium text-slate-600">
          Date
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2"
          />
        </label>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_2fr]">
        <HealthScorePanel score={data?.dailyHealthScore} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Calories" value={data?.totals?.calories} unit="kcal" goal={data?.goals?.calories} accent="bg-cyan-500" />
          <MetricCard label="Protein" value={data?.totals?.protein} unit="g" goal={data?.goals?.protein} accent="bg-emerald-500" />
          <MetricCard label="Carbs" value={data?.totals?.carbs} unit="g" goal={data?.goals?.carbs} accent="bg-amber-500" />
          <MetricCard label="Fat" value={data?.totals?.fat} unit="g" goal={data?.goals?.fat} accent="bg-rose-500" />
          <MetricCard label="Fiber" value={data?.totals?.fiber} unit="g" goal={data?.goals?.fiber} accent="bg-lime-500" />
          <MetricCard label="Water" value={data?.waterIntakeMl} unit="ml" goal={data?.goals?.water} accent="bg-sky-500" />
          <MetricCard label="Weight" value={latestWeight} unit="kg" accent="bg-violet-500" />
          <MetricCard label="Exercise" value={data?.caloriesBurned} unit="kcal" goal={300} accent="bg-orange-500" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Nutrition vs goals</h2>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nutritionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="goal" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="value" fill="#14B8A6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Weight trend</h2>
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

export default DashboardPage;
