import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    badge_key: {
      type: String,
      required: true,
      trim: true,
    },
    earned_at: {
      type: Date,
      default: Date.now,
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

achievementSchema.index({ user: 1, badge_key: 1 }, { unique: true });

export default mongoose.model('Achievement', achievementSchema);
