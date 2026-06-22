import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
    adminReply: {
  type: String,
  default: '',
},
reviewedAt: {
  type: Date,
  default: null,
},

    status: {
      type: String,
      enum: ['Pending', 'Reviewed'],
      default: 'Pending',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.model(
  'Feedback',
  feedbackSchema
);