const LogList = ({ title, emptyText, items = [], renderItem }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
    <div className="mt-4 space-y-3">
      {items.length ? items.map(renderItem) : <p className="text-sm text-slate-500">{emptyText}</p>}
    </div>
  </section>
);

export default LogList;
