import mongoose from 'mongoose';

const cyberExpertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  casesResolved: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('CyberExpert', cyberExpertSchema);
