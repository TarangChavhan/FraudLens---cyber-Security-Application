import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    reporter: {
      type: String,
      required: [true, 'Reporter name is required'],
      trim: true,
    },
    reporterEmail: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      required: [true, 'Fraud type is required'],
      trim: true,
      default: 'Phishing',
    },
    location: {
      type: String,
      default: 'Mumbai',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    link: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Solved'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    expert: {
      type: String,
      default: null,
    },
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
    notes: {
      type: String,
      default: '',
    },
    aiAnalysis: {
      riskScore: { type: Number, default: null },
      verdict: { type: String, default: '' },
      threatLevel: { type: String, default: '' },
      summary: { type: String, default: '' },
      countermeasures: [{ type: String }],
      investigationClues: [{ type: String }],
      analyzedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
