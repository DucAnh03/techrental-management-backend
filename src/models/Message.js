// src/models/Message.js
import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose; // 👈 có Types ở đây

const MessageSchema = new Schema(
  {
    roomId: { type: Types.ObjectId, ref: 'ChatRoom', required: true },
    senderId: { type: Types.ObjectId, required: true },
    senderType: { type: String, enum: ['user', 'shop'], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default model('Message', MessageSchema);
