import mongoose from 'mongoose';

const linkCheckSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    verdict: {
      type: String,
      enum: ['Safe', 'Suspicious', 'Dangerous'],
      required: true,
    },
    threatType: {
      type: String,
      default: 'Unknown',
    },
    summary: {
      type: String,
      default: '',
    },
    hits: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    analyzedByAI: {
      type: Boolean,
      default: false,
    },
    checkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

linkCheckSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

const LinkCheck = mongoose.model('LinkCheck', linkCheckSchema);
export default LinkCheck;
