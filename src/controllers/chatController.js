import * as chatSrv from '../service/chat.service.js';
import ChatRoom from '../models/ChatRoom.js';

export async function getAllRooms(req, res) {
  const rooms = await chatSrv.findAllRoomsByUser(req.user._id);
  res.json(rooms);
}

export async function getOrCreateRoom(req, res) {
  try {
    const room = await chatSrv.getOrCreateRoom(req.user._id, req.body.shopId);
    res.json(room);
  } catch (err) {
    if (err.message === 'SHOP_NOT_FOUND')
      return res.status(404).json({ message: 'Shop not found' });
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getMessages(req, res) {
  const msgs = await chatSrv.findMessages(req.params.roomId);
  res.json(msgs);
}

export async function sendMessage(req, res) {
  try {
    const { roomId } = req.params;
    const { content, shopId } = req.body;
    const userId = req.user._id;

    if (!content)
      return res.status(400).json({ message: 'Content is required' });

    let room = null;

    // Nếu có roomId trên URL → tìm trực tiếp
    if (roomId && roomId !== 'undefined') {
      room = await ChatRoom.findById(roomId);
    }

    // Nếu chưa tìm được & client gửi shopId → tạo/lấy phòng
    if (!room && shopId) {
      room = await chatSrv.getOrCreateRoom(userId, shopId);
    }

    if (!room) return res.status(404).json({ message: 'Room not found' });

    const senderType = room.userId.equals(userId) ? 'user' : 'shop';

    const msg = await chatSrv.createMessage(
      room._id, // luôn là ObjectId
      userId,
      senderType,
      content
    );

    req.app.get('io')?.to(room._id.toString()).emit('newMessage', msg);

    return res.status(201).json(msg);
  } catch (err) {
    console.error('SendMessage error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
}
