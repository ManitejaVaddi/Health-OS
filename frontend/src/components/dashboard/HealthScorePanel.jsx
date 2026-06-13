const HealthScorePanel = ({ score = 0 }) => {
  const normalized = Math.max(0, Math.min(100, Number(score) || 0));
  const status = normalized >= 80 ? 'Strong' : normalized >= 60 ? 'Steady' : 'Needs attention';

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Health Score</p>
          <h2 className="mt-2 text-4xl font-semibold text-slate-950">{normalized}</h2>
          <p className="mt-1 text-sm text-slate-500">{status}</p>
        </div>
        <div className="grid h-28 w-28 place-items-center rounded-full border-[10px] border-teal-500 bg-teal-50 text-lg font-semibold text-teal-700">
          {normalized}%
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-teal-500" style={{ width: `${normalized}%` }} />
      </div>
    </section>
  );
};

export default HealthScorePanel;
