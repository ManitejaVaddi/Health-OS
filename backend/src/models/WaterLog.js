import mongoose from 'mongoose';

const waterLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    log_date: {
      type: String,
      required: true,
      index: true,
    },
    amount_ml: {
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

waterLogSchema.index({ user: 1, log_date: 1, created_at: -1 });

export default mongoose.model('WaterLog', waterLogSchema);
