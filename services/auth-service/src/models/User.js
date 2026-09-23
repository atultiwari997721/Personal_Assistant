import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: 'https://api.dicebear.com/7.x/bottts/svg?seed=cortex',
    },
    credits: {
      type: Number,
      default: 20, // Initial free credits for new users
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Fallback in-memory map if MongoDB is unavailable
export const memoryUserStore = new Map();

// Seed a demo user in memory for immediate dev readiness
memoryUserStore.set('demo-user-123', {
  uid: 'demo-user-123',
  name: 'Demo Architect',
  email: 'demo@cortexai.dev',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Architect',
  credits: 50,
  createdAt: new Date(),
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
