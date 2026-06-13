import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    exercise_date: {
      type: String,
      required: true,
      index: true,
    },
    activity: {
      type: String,
      required: true,
      trim: true,
    },
    duration_minutes: {
      type: Number,
      required: true,
      min: 0,
    },
    calories_burned: {
      type: Number,
      required: true,
      min: 0,
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

exerciseSchema.index({ user: 1, exercise_date: 1, created_at: -1 });

export default mongoose.model('Exercise', exerciseSchema);
