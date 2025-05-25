// ---- phiên bản rút gọn, không JSDoc ----
import { Types } from 'mongoose';
import ChatRoom from '../models/ChatRoom.js';
import Message from '../models/Message.js';
import Shop from '../models/ShopDetail.js';

function toObjectId(id) {
  if (id instanceof Types.ObjectId) return id;
  if (typeof id === 'string' && Types.ObjectId.isValid(id))
    return new Types.ObjectId(id);
  throw new Error('INVALID_OBJECT_ID');
}

export async function findAllRoomsByUser(userId) {
  return ChatRoom.find({ userId: toObjectId(userId) })
    .populate('shopId', 'name avatar')
    .sort({ lastMessageTime: -1 });
}

export async function getOrCreateRoom(userId, shopId) {
  const userObj = toObjectId(userId);
  const shopObj = toObjectId(shopId);

  let room = await ChatRoom.findOne({ userId: userObj, shopId: shopObj });
  if (room) return room;

  if (!(await Shop.exists({ _id: shopObj }))) throw new Error('SHOP_NOT_FOUND');

  return ChatRoom.create({ userId: userObj, shopId: shopObj });
}

export function findMessages(roomId) {
  return Message.find({ roomId: toObjectId(roomId) }).sort({ createdAt: 1 });
}

export async function createMessage(roomId, senderId, senderType, content) {
  if (!content) throw new Error('EMPTY_CONTENT');

  const roomObj = toObjectId(roomId);
  const senderObj = toObjectId(senderId);

  const msg = await Message.create({
    roomId: roomObj,
    senderId: senderObj,
    senderType,
    content,
  });

  await ChatRoom.findByIdAndUpdate(roomObj, {
    lastMessage: content,
    lastMessageTime: new Date(),
  });

  return msg;
}
