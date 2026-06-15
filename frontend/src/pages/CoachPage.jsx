import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { askCoach } from '../api/coachApi';

const CoachPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const coachMutation = useMutation({
    mutationFn: askCoach,

    onSuccess: (data) => {
      setAnswer(data.answer);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    coachMutation.mutate(question);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">

        <p className="text-sm font-medium text-brand-600">
          HealthOS AI Coach
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Ask Anything About Nutrition & Fitness
        </h1>

        <p className="mt-2 text-slate-500">
          Personalized advice powered by Gemini AI.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <textarea
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            rows={5}
            placeholder="Example: I want to lose 5kg in 2 months. What should I eat?"
            className="w-full rounded-2xl border border-slate-200 p-4 focus:border-brand-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={coachMutation.isPending}
            className="rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-70"
          >
            {coachMutation.isPending
              ? 'Thinking...'
              : 'Ask Coach'}
          </button>
        </form>
      </div>

      {answer && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">

          <h2 className="text-xl font-semibold text-slate-900">
            HealthOS Recommendation
          </h2>

          <div className="mt-4 whitespace-pre-wrap text-slate-700">
            {answer}
          </div>

        </div>
      )}

    </div>
  );
};

export default CoachPage;