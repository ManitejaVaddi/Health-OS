import User from '../models/User.js';
import FoodLog from '../models/FoodLog.js';
import Exercise from '../models/Exercise.js';
import WaterLog from '../models/WaterLog.js';
import WeightLog from '../models/WeightLog.js';
import HealthScore from '../models/HealthScore.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalMeals,
      totalExercises,
      totalWaterLogs,
      totalWeightLogs,
      totalScores,
    ] = await Promise.all([
      User.countDocuments(),
      FoodLog.countDocuments(),
      Exercise.countDocuments(),
      WaterLog.countDocuments(),
      WeightLog.countDocuments(),
      HealthScore.countDocuments(),
    ]);

    const avgScore = await HealthScore.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
        },
      },
    ]);

    res.json({
      totalUsers,
      totalMeals,
      totalExercises,
      totalWaterLogs,
      totalWeightLogs,
      averageHealthScore:
        avgScore.length > 0
          ? Math.round(avgScore[0].averageScore)
          : 0,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select(
  'name email role goal streak age gender weight_kg target_weight_kg created_at'
)
      .sort({ created_at: -1 });

    res.json(users);
  } catch (error) {
    next(error);
  }
};
export const markFeedbackReviewed = async (
  req,
  res,
  next
) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Reviewed',
      },
      {
        new: true,
      }
    );

    if (!feedback) {
      res.status(404);
      throw new Error(
        'Feedback not found'
      );
    }

    res.json(feedback);
  } catch (error) {
    next(error);
  }
};