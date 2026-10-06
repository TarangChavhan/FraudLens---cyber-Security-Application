import mongoose from 'mongoose';

const urlCheckSchema = new mongoose.Schema({
  url: { type: String, required: true },
  status: { type: String, enum: ['SAFE', 'SUSPICIOUS', 'MALICIOUS'], required: true },
  checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: { type: String },
}, { timestamps: true });

export default mongoose.model('URLCheck', urlCheckSchema);
