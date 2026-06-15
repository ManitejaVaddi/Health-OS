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
  const latestScore =
  scores.length > 0
    ? scores[scores.length - 1].score
    : 0;

const weeklyAverage =
  scores.length > 0
    ? Math.round(
        scores
          .slice(-7)
          .reduce(
            (sum, item) => sum + item.score,
            0
          ) /
          Math.min(scores.length, 7)
      )
    : 0;

const monthlyAverage =
  scores.length > 0
    ? Math.round(
        scores.reduce(
          (sum, item) => sum + item.score,
          0
        ) / scores.length
      )
    : 0;

  if (scoresLoading || weightsLoading) {
    return <div className="p-6 text-slate-600">Loading progress...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <div className="grid gap-4 md:grid-cols-3">

  <div className="rounded-xl bg-white p-5 shadow">
    <p className="text-sm text-slate-500">
      Current Nutrition Score
    </p>

    <p className="mt-2 text-4xl font-bold text-emerald-600">
      {latestScore}/100
    </p>
  </div>

  <div className="rounded-xl bg-white p-5 shadow">
    <p className="text-sm text-slate-500">
      Weekly Average
    </p>

    <p className="mt-2 text-4xl font-bold text-blue-600">
      {weeklyAverage}/100
    </p>
  </div>

  <div className="rounded-xl bg-white p-5 shadow">
    <p className="text-sm text-slate-500">
      Monthly Average
    </p>

    <p className="mt-2 text-4xl font-bold text-violet-600">
      {monthlyAverage}/100
    </p>
  </div>

  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">

  <h2 className="text-lg font-semibold">
    Nutrition Quality Analysis
  </h2>

  <div className="mt-5 grid gap-4 md:grid-cols-2">

    <div className="rounded-lg bg-slate-50 p-4">
      <p className="font-medium">
        Protein Goal
      </p>

      <p className="mt-2 text-green-600">
        ✓ High protein intake improves score
      </p>
    </div>

    <div className="rounded-lg bg-slate-50 p-4">
      <p className="font-medium">
        Fiber Goal
      </p>

      <p className="mt-2 text-green-600">
        ✓ Supports digestion & gut health
      </p>
    </div>

    <div className="rounded-lg bg-slate-50 p-4">
      <p className="font-medium">
        Water Intake
      </p>

      <p className="mt-2 text-amber-600">
        Drink more water to improve score
      </p>
    </div>

    <div className="rounded-lg bg-slate-50 p-4">
      <p className="font-medium">
        Daily Consistency
      </p>

      <p className="mt-2 text-green-600">
        Logging meals regularly improves score
      </p>
    </div>

  </div>

</section>

</div>
        <p className="text-sm font-medium text-brand-700">Progress Center</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-950">Health score and weight trends</h1>
      </header>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">

  <h2 className="text-lg font-semibold">
    HealthOS Recommendations
  </h2>

  <ul className="mt-4 space-y-3 text-slate-700">

    <li>
      • Aim for at least 100g protein daily.
    </li>

    <li>
      • Target 25–30g fiber every day.
    </li>

    <li>
      • Drink 2.5–3 liters of water.
    </li>

    <li>
      • Maintain consistent meal logging.
    </li>

  </ul>

</section>

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
