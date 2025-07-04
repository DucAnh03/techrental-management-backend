import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
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
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
    },

    roles: {
      type: [String],
      enum: ['renter', 'owner', 'admin'],
      default: ['renter'],
    },
    resetCode: {
      type: String,
    },
    resetCodeExpiry: {
      type: Date,
    },

    identityVerification: {
      status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
      },
      cccdNumber: {
        type: String,
        unique: true,
        sparse: true,
      },
      address: {
        type: String,
      },
      documentUrl: {
        type: String,
      },
      verifiedAt: {
        type: Date,
      },
    },
    ratings: [
      {
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    walletBalance: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    dateOfBirth: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
