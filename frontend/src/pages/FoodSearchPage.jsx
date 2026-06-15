import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addMeal, searchFood } from '../api/userApi';
import { getToday } from '../utils/date';

const nutrientValue = (food, names) => {
  const namesList = Array.isArray(names) ? names : [names];
  const nutrient = food.foodNutrients?.find((item) => namesList.includes(item.nutrientName));
  return Math.round(Number(nutrient?.value) || 0);
};

const calculateHealthScore = (protein, fiber, fat, carbs) => {
  let score = 50;

  if (protein >= 20) score += 20;
  if (fiber >= 5) score += 15;
  if (fat <= 15) score += 10;
  if (carbs <= 40) score += 5;

  return Math.min(score, 100);
};

const getVitaminNames = (food) => {
  return (
    food.foodNutrients
      ?.filter((item) =>
        item.nutrientName?.toLowerCase().includes('vitamin')
      )
      .slice(0, 5)
      .map((item) => item.nutrientName) || []
  );
};

const scaleValue = (value, quantity) => {
  return Math.round((value * quantity) / 100);
};

const FoodSearchPage = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [quantities, setQuantities] = useState({});
  const [mealTypes, setMealTypes] = useState({});

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

  const handleAddMeal = (
  food,
  quantity = 100,
  mealType = 'Breakfast'
) => {
  addMealMutation.mutate({
    meal_type: mealType,quantity,
    meal_date: selectedDate,
    name: food.description,
    calories: scaleValue(
      nutrientValue(food, 'Energy'),
      quantity
    ),
    protein: scaleValue(
      nutrientValue(food, 'Protein'),
      quantity
    ),
    carbs: scaleValue(
      nutrientValue(food, 'Carbohydrate, by difference'),
      quantity
    ),
    fat: scaleValue(
      nutrientValue(food, 'Total lipid (fat)'),
      quantity
    ),
    fiber: scaleValue(
      nutrientValue(food, 'Fiber, total dietary'),
      quantity
    ),
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
          const quantity = quantities[food.fdcId] || 100;

const scaledCalories = scaleValue(calories, quantity);
const scaledProtein = scaleValue(protein, quantity);
const scaledCarbs = scaleValue(carbs, quantity);
const scaledFat = scaleValue(fat, quantity);
const scaledFiber = scaleValue(fiber, quantity);

const healthScore = calculateHealthScore(
  scaledProtein,
  scaledFiber,
  scaledFat,
  scaledCarbs
);

const vitamins = getVitaminNames(food);
          


          return (
            <article key={food.fdcId} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-950"> {food.description} </h2>
                    <p className="mt-1 text-sm text-slate-500">{food.brandOwner || food.dataType || 'USDA'}</p>
                      <div className="mt-3">
                         <label className="text-xs text-slate-500">  Quantity </label>

    <select
      value={quantity}
      onChange={(e) =>
        setQuantities((prev) => ({
          ...prev,
          [food.fdcId]: Number(e.target.value),
        }))
      }
      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
    >
      <option value={100}>100g</option>
      <option value={250}>250g</option>
      <option value={500}>500g</option>
    </select>
  </div>
  <div className="mt-3">
  <label className="text-xs text-slate-500">
    Meal Type
  </label>

  <select
    value={mealTypes[food.fdcId] || 'Breakfast'}
    onChange={(e) =>
      setMealTypes((prev) => ({
        ...prev,
        [food.fdcId]: e.target.value,
      }))
    }
    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
  >
    <option value="Breakfast">Breakfast</option>
    <option value="Lunch">Lunch</option>
    <option value="Dinner">Dinner</option>
    <option value="Snack">Snack</option>
  </select>
</div>
</div>
                {/* <button
                  type="button"
                 onClick={() => handleAddMeal(food, quantity)}
                  disabled={addMealMutation.isPending}
                  className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  Add
                </button> */}
                <button
  type="button"
  onClick={() =>
  handleAddMeal(
    food,
    quantity,
    mealTypes[food.fdcId] || 'Breakfast'
  )
}
  disabled={addMealMutation.isPending}
  className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
>
  Add Meal
</button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">

  <div className="rounded-lg bg-slate-50 p-3">
    <p className="text-xs text-slate-500">Calories</p>
    <p className="font-semibold">
      {scaledCalories} kcal
    </p>
  </div>

  <div className="rounded-lg bg-slate-50 p-3">
    <p className="text-xs text-slate-500">Protein</p>
    <p className="font-semibold">
      {scaledProtein}g
    </p>
  </div>

  <div className="rounded-lg bg-slate-50 p-3">
    <p className="text-xs text-slate-500">Carbs</p>
    <p className="font-semibold">
      {scaledCarbs}g
    </p>
  </div>

  <div className="rounded-lg bg-slate-50 p-3">
    <p className="text-xs text-slate-500">Fat</p>
    <p className="font-semibold">
      {scaledFat}g
    </p>
  </div>

  <div className="rounded-lg bg-slate-50 p-3 col-span-2">
    <p className="text-xs text-slate-500">Fiber</p>
    <p className="font-semibold">
      {scaledFiber}g
    </p>
  </div>

</div>
<div className="mt-4 rounded-lg bg-green-50 p-3">
  <p className="font-semibold text-green-700">
    Health Score: {healthScore}/100
  </p>
</div>
{vitamins.length > 0 && (
  <div className="mt-4">
    <p className="mb-2 text-sm font-semibold">
      Vitamins
    </p>

    <div className="flex flex-wrap gap-2">
      {vitamins.map((vitamin) => (
        <span
          key={vitamin}
          className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700"
        >
          {vitamin}
        </span>
      ))}
    </div>
  </div>
)}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default FoodSearchPage;
