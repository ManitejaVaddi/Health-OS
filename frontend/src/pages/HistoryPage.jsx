import { useQuery } from '@tanstack/react-query';
import { getHistory } from '../api/userApi';

const HistorySection = ({ title, items = [], emptyText, renderItem }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
    <div className="mt-4 space-y-3">
      {items.length ? items.map(renderItem) : <p className="text-sm text-slate-500">{emptyText}</p>}
    </div>
  </section>
);

const HistoryPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['history'],
    queryFn: getHistory,
    retry: false,
  });

  if (isLoading) return <div className="p-6 text-slate-600">Loading history...</div>;
  if (error) return <div className="p-6 text-red-600">Unable to load history.</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <p className="text-sm font-medium text-brand-700">HealthOS History</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-950">Complete tracking history</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <HistorySection
          title="Food Logs"
          items={data?.meals}
          emptyText="No food logs yet."
          renderItem={(meal) => (
            <div key={meal.id} className="rounded-lg bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">{meal.name}</p>
              <p className="mt-1 text-sm text-slate-600">{meal.meal_date} | {meal.calories} kcal | P {meal.protein}g | C {meal.carbs}g | F {meal.fat}g</p>
            </div>
          )}
        />
        <HistorySection
          title="Exercise Logs"
          items={data?.exercises}
          emptyText="No exercise logs yet."
          renderItem={(exercise) => (
            <div key={exercise.id} className="rounded-lg bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">{exercise.activity}</p>
              <p className="mt-1 text-sm text-slate-600">{exercise.exercise_date} | {exercise.duration_minutes} min | {exercise.calories_burned} kcal</p>
            </div>
          )}
        />
        <HistorySection
          title="Water Logs"
          items={data?.waters}
          emptyText="No water logs yet."
          renderItem={(water) => (
            <div key={water.id} className="rounded-lg bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">{water.amount_ml} ml</p>
              <p className="mt-1 text-sm text-slate-600">{water.log_date}</p>
            </div>
          )}
        />
        <HistorySection
          title="Weight Logs"
          items={data?.weights}
          emptyText="No weight logs yet."
          renderItem={(weight) => (
            <div key={weight.id} className="rounded-lg bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">{weight.weight_kg} kg</p>
              <p className="mt-1 text-sm text-slate-600">{weight.record_date}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default HistoryPage;
