import axios from 'axios';
import User from '../models/User.js';
import FoodLog from '../models/FoodLog.js';
import Exercise from '../models/Exercise.js';
import WaterLog from '../models/WaterLog.js';
import WeightLog from '../models/WeightLog.js';
import HealthScore from '../models/HealthScore.js';

const getDateValue = (dateValue) => {
  return dateValue ? new Date(dateValue).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
};

const estimateCalories = (profile = {}) => {
  let bmr = 2000;
  const gender = profile.gender?.toLowerCase();

  if (profile.age && profile.height_cm && profile.weight_kg && gender) {
    if (gender === 'male') {
      bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161;
    }
  }

  if (profile.goal?.toLowerCase().includes('lose')) {
    return Math.round(bmr * 0.85);
  }
  if (profile.goal?.toLowerCase().includes('build') || profile.goal?.toLowerCase().includes('gain')) {
    return Math.round(bmr * 1.15);
  }
  return Math.round(bmr * 1.05);
};

const calculateHealthScore = (totals, waterIntakeMl, caloriesBurned, goals) => {
  const calorieGoal = goals.calories || 2000;
  const proteinGoal = goals.protein || 100;
  const carbsGoal = goals.carbs || 250;
  const fatGoal = goals.fat || 70;
  const fiberGoal = goals.fiber || 30;
  const waterGoal = goals.water || 2000;

  const calorieScore = Math.max(0, 100 - Math.min(100, Math.abs(totals.calories - calorieGoal) / calorieGoal * 100));
  const proteinScore = Math.min(100, (totals.protein / proteinGoal) * 100);
  const carbsScore = Math.min(100, (totals.carbs / carbsGoal) * 100);
  const fatScore = Math.min(100, (totals.fat / fatGoal) * 100);
  const fiberScore = Math.min(100, (totals.fiber / fiberGoal) * 100);
  const waterScore = Math.min(100, (waterIntakeMl / waterGoal) * 100);
  const activityScore = Math.min(100, (caloriesBurned / 300) * 100);

  const macroScore = (proteinScore + carbsScore + fatScore + fiberScore) / 4;
  const score = calorieScore * 0.35 + macroScore * 0.35 + waterScore * 0.2 + activityScore * 0.1;

  return Math.round(Math.max(0, Math.min(100, score)));
};

const buildDailySummary = async (user, date) => {
  const userId = user.id;
  const profile = await User.findById(userId).select('age gender height_cm weight_kg goal') || {};
  const caloriesGoal = estimateCalories(profile);
  const goals = {
    calories: caloriesGoal,
    protein: Math.round(caloriesGoal * 0.2 / 4),
    carbs: Math.round(caloriesGoal * 0.45 / 4),
    fat: Math.round(caloriesGoal * 0.3 / 9),
    fiber: 30,
    water: 2000,
  };

  const [meals, exercises, waterTotals, weightHistory] = await Promise.all([
    FoodLog.find({ user: userId, meal_date: date }).sort({ created_at: -1 }),
    Exercise.find({ user: userId, exercise_date: date }).sort({ created_at: -1 }),
    WaterLog.aggregate([
      { $match: { user: user._id, log_date: date } },
      { $group: { _id: null, total_ml: { $sum: '$amount_ml' } } },
    ]),
    WeightLog.find({ user: userId }).sort({ record_date: 1, created_at: 1 }).limit(30).select('record_date weight_kg'),
  ]);

  const totals = meals.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      acc.fiber += item.fiber;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const caloriesBurned = exercises.reduce((sum, item) => sum + item.calories_burned, 0);
  const waterIntakeMl = Number(waterTotals[0]?.total_ml) || 0;
  const dailyHealthScore = calculateHealthScore(totals, waterIntakeMl, caloriesBurned, goals);

  await HealthScore.findOneAndUpdate(
    { user: userId, score_date: date },
    {
      score: dailyHealthScore,
      totals,
      waterIntakeMl,
      caloriesBurned,
      goals,
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return {
    date,
    totals,
    meals,
    exercises,
    caloriesBurned,
    waterIntakeMl,
    weightHistory,
    latestWeight: weightHistory.at(-1) || null,
    goals,
    dailyHealthScore,
  };
};

export const searchFood = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      res.status(400);
      throw new Error('Search query is required');
    }

    const response = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search', {
      params: {
        api_key: process.env.USDA_API_KEY,
        query,
        pageSize: 12,
      },
    });

    res.json({ foods: response.data.foods || [] });
  } catch (error) {
    next(error);
  }
};

export const getDailySummary = async (req, res, next) => {
  try {
    const date = getDateValue(req.query.date);
    const summary = await buildDailySummary(req.user, date);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

export const getHealthScore = async (req, res, next) => {
  try {
    const date = getDateValue(req.query.date);
    const summary = await buildDailySummary(req.user, date);
    res.json({
      date,
      score: summary.dailyHealthScore,
      totals: summary.totals,
      waterIntakeMl: summary.waterIntakeMl,
      caloriesBurned: summary.caloriesBurned,
      goals: summary.goals,
    });
  } catch (error) {
    next(error);
  }
};

export const getHealthScoreHistory = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 90);
    const scores = await HealthScore.find({ user: req.user.id }).sort({ score_date: -1 }).limit(limit);
    res.json(scores);
  } catch (error) {
    next(error);
  }
};

export const getMeals = async (req, res, next) => {
  try {
    const date = getDateValue(req.query.date);
    const meals = await FoodLog.find({ user: req.user.id, meal_date: date }).sort({ created_at: -1 });
    res.json(meals);
  } catch (error) {
    next(error);
  }
};

export const getExercises = async (req, res, next) => {
  try {
    const date = getDateValue(req.query.date);
    const exercises = await Exercise.find({ user: req.user.id, exercise_date: date }).sort({ created_at: -1 });
    res.json(exercises);
  } catch (error) {
    next(error);
  }
};

export const getWaters = async (req, res, next) => {
  try {
    const date = getDateValue(req.query.date);
    const waters = await WaterLog.find({ user: req.user.id, log_date: date }).sort({ created_at: -1 });
    res.json(waters);
  } catch (error) {
    next(error);
  }
};

export const getWeights = async (req, res, next) => {
  try {
    const weights = await WeightLog.find({ user: req.user.id }).sort({ record_date: -1, created_at: -1 }).limit(30);
    res.json(weights);
  } catch (error) {
    next(error);
  }
};

export const addMeal = async (req, res, next) => {
  try {
    const { meal_date, name, calories, protein, carbs, fat, fiber } = req.body;
    const meal = await FoodLog.create({
      user: req.user.id,
      meal_date: meal_date || getDateValue(),
      name,
      calories,
      protein,
      carbs,
      fat,
      fiber,
    });
    res.status(201).json(meal);
  } catch (error) {
    next(error);
  }
};

export const addExercise = async (req, res, next) => {
  try {
    const { exercise_date, activity, duration_minutes, calories_burned } = req.body;
    const exercise = await Exercise.create({
      user: req.user.id,
      exercise_date: exercise_date || getDateValue(),
      activity,
      duration_minutes,
      calories_burned,
    });
    res.status(201).json(exercise);
  } catch (error) {
    next(error);
  }
};

export const addWater = async (req, res, next) => {
  try {
    const { log_date, amount_ml } = req.body;
    const water = await WaterLog.create({
      user: req.user.id,
      log_date: log_date || getDateValue(),
      amount_ml,
    });
    res.status(201).json(water);
  } catch (error) {
    next(error);
  }
};

export const addWeight = async (req, res, next) => {
  try {
    const { record_date, weight_kg } = req.body;
    const weight = await WeightLog.create({
      user: req.user.id,
      record_date: record_date || getDateValue(),
      weight_kg,
    });
    res.status(201).json(weight);
  } catch (error) {
    next(error);
  }
};

export const getNutritionAdvice = async (req, res, next) => {
  try {
    const profile = await User.findById(req.user.id).select('name age gender height_cm weight_kg goal') || {};
    const prompt = `You are a helpful nutrition coach for a user who is ${profile.age || 'an adult'} years old, ${profile.gender || 'of unknown gender'}, with a goal to ${profile.goal || 'stay healthy'}. Provide a concise, positive nutrition and hydration tip that helps them balance meals, track macros, and stay consistent.`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        advice: `Welcome to NutriAI! Focus on balanced meals with lean protein, whole grains, and vegetables, drink water steadily through the day, and log your progress daily. Update your profile and use the dashboard to stay on track.`,
      });
    }

    const response = await axios.post(
      'https://gemini.googleapis.com/v1/models/chat-bison-001:generateMessage',
      {
        model: 'chat-bison-001',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const advice = response.data?.candidates?.[0]?.content || response.data?.output?.[0]?.content || `Keep tracking your meals, water, and exercise consistently for better progress.`;

    res.json({ advice });
  } catch (error) {
    next(error);
  }
};
