import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addExercise,
  addMeal,
  addWater,
  addWeight,
  getExercises,
  getMeals,
  getWaterLogs,
  getWeightHistory,
} from '../api/userApi';
import LogList from '../components/tracking/LogList';
import TrackingForm from '../components/tracking/TrackingForm';
import { getToday } from '../utils/date';

const numberValue = (value) => Number(value || 0);

const TrackingPage = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [mealForm, setMealForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', fiber: '' });
  const [exerciseForm, setExerciseForm] = useState({ activity: '', duration_minutes: '', calories_burned: '' });
  const [waterForm, setWaterForm] = useState({ amount_ml: '' });
  const [weightForm, setWeightForm] = useState({ weight_kg: '' });

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['meals'] });
    queryClient.invalidateQueries({ queryKey: ['exercises'] });
    queryClient.invalidateQueries({ queryKey: ['waters'] });
    queryClient.invalidateQueries({ queryKey: ['weights'] });
    queryClient.invalidateQueries({ queryKey: ['health-scores'] });
  };

  const { data: meals = [] } = useQuery({ queryKey: ['meals', selectedDate], queryFn: () => getMeals(selectedDate), retry: false });
  const { data: exercises = [] } = useQuery({ queryKey: ['exercises', selectedDate], queryFn: () => getExercises(selectedDate), retry: false });
  const { data: waters = [] } = useQuery({ queryKey: ['waters', selectedDate], queryFn: () => getWaterLogs(selectedDate), retry: false });
  const { data: weights = [] } = useQuery({ queryKey: ['weights'], queryFn: getWeightHistory, retry: false });

  const mealMutation = useMutation({
    mutationFn: addMeal,
    onSuccess: () => {
      setMealForm({ name: '', calories: '', protein: '', carbs: '', fat: '', fiber: '' });
      refreshData();
    },
  });
  const exerciseMutation = useMutation({
    mutationFn: addExercise,
    onSuccess: () => {
      setExerciseForm({ activity: '', duration_minutes: '', calories_burned: '' });
      refreshData();
    },
  });
  const waterMutation = useMutation({
    mutationFn: addWater,
    onSuccess: () => {
      setWaterForm({ amount_ml: '' });
      refreshData();
    },
  });
  const weightMutation = useMutation({
    mutationFn: addWeight,
    onSuccess: () => {
      setWeightForm({ weight_kg: '' });
      refreshData();
    },
  });

  const updateForm = (setter) => (event) => {
    const { name, value } = event.target;
    setter((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-brand-700">HealthOS Tracking</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-950">Food, exercise, water, and weight logs</h1>
        </div>
        <label className="grid gap-1 text-sm font-medium text-slate-600">
          Log date
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2" />
        </label>
      </header>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <TrackingForm
          title="Food Tracking"
          fields={[
            { name: 'name', label: 'Food name', placeholder: 'Greek yogurt' },
            { name: 'calories', label: 'Calories', type: 'number', min: 0 },
            { name: 'protein', label: 'Protein (g)', type: 'number', min: 0 },
            { name: 'carbs', label: 'Carbs (g)', type: 'number', min: 0 },
            { name: 'fat', label: 'Fat (g)', type: 'number', min: 0 },
            { name: 'fiber', label: 'Fiber (g)', type: 'number', min: 0 },
          ]}
          values={mealForm}
          onChange={updateForm(setMealForm)}
          submitLabel="Add food"
          isSaving={mealMutation.isPending}
          onSubmit={(event) => {
            event.preventDefault();
            mealMutation.mutate({
              meal_date: selectedDate,
              name: mealForm.name,
              calories: numberValue(mealForm.calories),
              protein: numberValue(mealForm.protein),
              carbs: numberValue(mealForm.carbs),
              fat: numberValue(mealForm.fat),
              fiber: numberValue(mealForm.fiber),
            });
          }}
        />

        <TrackingForm
          title="Exercise Tracking"
          fields={[
            { name: 'activity', label: 'Activity', placeholder: 'Cycling' },
            { name: 'duration_minutes', label: 'Duration (min)', type: 'number', min: 0 },
            { name: 'calories_burned', label: 'Calories burned', type: 'number', min: 0 },
          ]}
          values={exerciseForm}
          onChange={updateForm(setExerciseForm)}
          submitLabel="Add exercise"
          isSaving={exerciseMutation.isPending}
          onSubmit={(event) => {
            event.preventDefault();
            exerciseMutation.mutate({
              exercise_date: selectedDate,
              activity: exerciseForm.activity,
              duration_minutes: numberValue(exerciseForm.duration_minutes),
              calories_burned: numberValue(exerciseForm.calories_burned),
            });
          }}
        />

        <TrackingForm
          title="Water Tracking"
          fields={[{ name: 'amount_ml', label: 'Amount (ml)', type: 'number', min: 0, placeholder: '500' }]}
          values={waterForm}
          onChange={updateForm(setWaterForm)}
          submitLabel="Log water"
          isSaving={waterMutation.isPending}
          onSubmit={(event) => {
            event.preventDefault();
            waterMutation.mutate({ log_date: selectedDate, amount_ml: numberValue(waterForm.amount_ml) });
          }}
        />

        <TrackingForm
          title="Weight Tracking"
          fields={[{ name: 'weight_kg', label: 'Weight (kg)', type: 'number', min: 0, step: '0.1', placeholder: '72.5' }]}
          values={weightForm}
          onChange={updateForm(setWeightForm)}
          submitLabel="Log weight"
          isSaving={weightMutation.isPending}
          onSubmit={(event) => {
            event.preventDefault();
            weightMutation.mutate({ record_date: selectedDate, weight_kg: numberValue(weightForm.weight_kg) });
          }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LogList
          title="Today's Food"
          emptyText="No food logged for this date."
          items={meals}
          renderItem={(meal) => (
            <div key={meal.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{meal.name}</p>
                <p className="text-sm text-slate-500">{meal.calories} kcal</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">Protein {meal.protein}g | Carbs {meal.carbs}g | Fat {meal.fat}g | Fiber {meal.fiber}g</p>
            </div>
          )}
        />

        <LogList
          title="Today's Exercise"
          emptyText="No exercise logged for this date."
          items={exercises}
          renderItem={(exercise) => (
            <div key={exercise.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{exercise.activity}</p>
                <p className="text-sm text-slate-500">{exercise.calories_burned} kcal</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">{exercise.duration_minutes} minutes</p>
            </div>
          )}
        />

        <LogList
          title="Today's Water"
          emptyText="No water logged for this date."
          items={waters}
          renderItem={(water) => (
            <div key={water.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-950">{water.amount_ml} ml</p>
              <p className="mt-1 text-sm text-slate-500">{water.log_date}</p>
            </div>
          )}
        />

        <LogList
          title="Recent Weight"
          emptyText="No weight records yet."
          items={weights}
          renderItem={(weight) => (
            <div key={weight.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-950">{weight.weight_kg} kg</p>
                <p className="text-sm text-slate-500">{weight.record_date}</p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default TrackingPage;
