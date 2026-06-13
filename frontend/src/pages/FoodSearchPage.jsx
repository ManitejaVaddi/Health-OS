import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addMeal, searchFood } from '../api/userApi';
import { getToday } from '../utils/date';

const nutrientValue = (food, names) => {
  const namesList = Array.isArray(names) ? names : [names];
  const nutrient = food.foodNutrients?.find((item) => namesList.includes(item.nutrientName));
  return Math.round(Number(nutrient?.value) || 0);
};

const FoodSearchPage = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(getToday());

  const { data, isFetching, error } = useQuery({
    queryKey: ['foodSearch', submittedQuery],
    queryFn: () => searchFood(submittedQuery),
    enabled: Boolean(submittedQuery),
    retry: false,
  });

  const addMealMutation = useMutation({
    mutationFn: addMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const handleSearch = (event) => {
    event.preventDefault();
    setSubmittedQuery(query.trim());
  };

  const handleAddMeal = (food) => {
    addMealMutation.mutate({
      meal_date: selectedDate,
      name: food.description,
      calories: nutrientValue(food, 'Energy'),
      protein: nutrientValue(food, 'Protein'),
      carbs: nutrientValue(food, 'Carbohydrate, by difference'),
      fat: nutrientValue(food, 'Total lipid (fat)'),
      fiber: nutrientValue(food, 'Fiber, total dietary'),
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-brand-700">Food Tracking</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-950">Search foods and add nutrition logs</h1>
        </div>
        <label className="grid gap-1 text-sm font-medium text-slate-600">
          Meal date
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2" />
        </label>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleSearch}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search chicken, oats, avocado..."
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500 focus:bg-white"
          />
          <button type="submit" className="rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-700">
            {isFetching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Unable to search food.</p>}
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data?.foods?.map((food) => {
          const calories = nutrientValue(food, 'Energy');
          const protein = nutrientValue(food, 'Protein');
          const carbs = nutrientValue(food, 'Carbohydrate, by difference');
          const fat = nutrientValue(food, 'Total lipid (fat)');
          const fiber = nutrientValue(food, 'Fiber, total dietary');

          return (
            <article key={food.fdcId} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">{food.description}</h2>
                  <p className="mt-1 text-sm text-slate-500">{food.brandOwner || food.dataType || 'USDA'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddMeal(food)}
                  disabled={addMealMutation.isPending}
                  className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  Add
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-700">
                <span>{calories} kcal</span>
                <span>{protein}g protein</span>
                <span>{carbs}g carbs</span>
                <span>{fat}g fat</span>
                <span>{fiber}g fiber</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default FoodSearchPage;
