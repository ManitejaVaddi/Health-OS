import express from 'express';
import {
  searchFood,
  getDailySummary,
  getMeals,
  getExercises,
  getWaters,
  getWeights,
  addMeal,
  addExercise,
  addWater,
  addWeight,
  getHealthScore,
  getHealthScoreHistory,
  getNutritionAdvice,
} from '../controllers/apiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/food/search', protect, searchFood);
router.get('/dashboard', protect, getDailySummary);
router.get('/meals', protect, getMeals);
router.get('/exercises', protect, getExercises);
router.get('/waters', protect, getWaters);
router.get('/weights', protect, getWeights);
router.get('/health-score', protect, getHealthScore);
router.get('/health-scores', protect, getHealthScoreHistory);
router.get('/coach', protect, getNutritionAdvice);
router.post('/meals', protect, addMeal);
router.post('/exercises', protect, addExercise);
router.post('/water', protect, addWater);
router.post('/waters', protect, addWater);
router.post('/weight', protect, addWeight);
router.post('/weights', protect, addWeight);

export default router;
