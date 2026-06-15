import mongoose from 'mongoose';

const foodLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    meal_date: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    meal_type: {
  type: String,
  enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
  default: 'Breakfast',
},
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    protein: {
      type: Number,
      required: true,
      min: 0,
    },
    carbs: {
      type: Number,
      required: true,
      min: 0,
    },
    fat: {
      type: Number,
      required: true,
      min: 0,
    },
    fiber: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
  type: Number,
  required: true,
  default: 100,
  min: 1,
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

foodLogSchema.index({ user: 1, meal_date: 1, created_at: -1 });

export default mongoose.model('FoodLog', foodLogSchema);
