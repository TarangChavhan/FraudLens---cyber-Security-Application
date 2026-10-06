import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, default: '', trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'CYBER_EXPERT'],
      default: 'USER',
    },
  },
  { timestamps: true }
);

// Avoid exposing passwordHash in JSON responses and format _id as id
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
