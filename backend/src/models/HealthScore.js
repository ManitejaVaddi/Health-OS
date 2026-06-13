import mongoose from 'mongoose';

const macroTotalsSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
  },
  { _id: false }
);

const goalsSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 2000 },
    protein: { type: Number, default: 100 },
    carbs: { type: Number, default: 250 },
    fat: { type: Number, default: 70 },
    fiber: { type: Number, default: 30 },
    water: { type: Number, default: 2000 },
  },
  { _id: false }
);

const healthScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    score_date: {
      type: String,
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totals: {
      type: macroTotalsSchema,
      default: () => ({}),
    },
    waterIntakeMl: {
      type: Number,
      default: 0,
      min: 0,
    },
    caloriesBurned: {
      type: Number,
      default: 0,
      min: 0,
    },
    goals: {
      type: goalsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.user_id = ret.user;
        delete ret._id;
        delete ret.user;
        return ret;
      },
    },
  }
);

healthScoreSchema.index({ user: 1, score_date: 1 }, { unique: true });

export default mongoose.model('HealthScore', healthScoreSchema);
