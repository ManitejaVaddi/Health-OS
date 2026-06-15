import User from '../models/User.js';
import FoodLog from '../models/FoodLog.js';
import Exercise from '../models/Exercise.js';
import WaterLog from '../models/WaterLog.js';
import WeightLog from '../models/WeightLog.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('Profile not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const {
  name,
  age,
  gender,
  height_cm,
  weight_kg,
  target_weight_kg,
  activity_level,
  diet_type,
  goal,
} = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, age, gender, height_cm, weight_kg, goal },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404);
      throw new Error('Profile not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [meals, exercises, waters, weights] = await Promise.all([
      FoodLog.find({ user: userId }).sort({ created_at: -1 }),
      Exercise.find({ user: userId }).sort({ created_at: -1 }),
      WaterLog.find({ user: userId }).sort({ created_at: -1 }),
      WeightLog.find({ user: userId }).sort({ created_at: -1 }),
    ]);

    res.json({
      meals,
      exercises,
      waters,
      weights
    });

  } catch (err) {
    next(err);
  }
};
