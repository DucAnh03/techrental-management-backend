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
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    roles: {
      type: [String],
      enum: ['renter', 'owner', 'admin'],
      default: ['renter'],
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
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
