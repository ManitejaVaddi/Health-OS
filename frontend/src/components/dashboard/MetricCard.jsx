const MetricCard = ({ label, value, unit, goal, accent = 'bg-teal-500' }) => {
  const numericValue = Number(value) || 0;
  const numericGoal = Number(goal) || 0;
  const percent = numericGoal ? Math.min(100, Math.round((numericValue / numericGoal) * 100)) : 0;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {numericValue}
            {unit && <span className="ml-1 text-sm font-medium text-slate-500">{unit}</span>}
          </p>
        </div>
        {numericGoal > 0 && <span className="text-xs font-medium text-slate-500">{percent}%</span>}
      </div>
      {numericGoal > 0 && (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${accent}`} style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-500">Goal {numericGoal}{unit ? ` ${unit}` : ''}</p>
        </div>
      )}
    </article>
  );
};

export default MetricCard;
