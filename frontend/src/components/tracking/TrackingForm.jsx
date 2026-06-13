const inputClass = 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500';

const TrackingForm = ({ title, fields, values, onChange, onSubmit, submitLabel, isSaving }) => {
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
        {fields.map((field) => (
          <label key={field.name} className="grid gap-1 text-sm font-medium text-slate-600">
            {field.label}
            <input
              type={field.type || 'text'}
              min={field.min}
              step={field.step}
              name={field.name}
              value={values[field.name] ?? ''}
              onChange={onChange}
              placeholder={field.placeholder}
              required={field.required !== false}
              className={inputClass}
            />
          </label>
        ))}
        <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60" disabled={isSaving}>
          {isSaving ? 'Saving...' : submitLabel}
        </button>
      </form>
    </section>
  );
};

export default TrackingForm;
