import * as chatSrv from '../service/chat.service.js';
import ChatRoom from '../models/ChatRoom.js';
import Message from '../models/Message.js';
import Shop from '../models/ShopDetail.js';

export async function getAllRooms(req, res) {
  try {
    const rooms = await chatSrv.findAllRoomsByUser(req.user._id);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Không thể lấy danh sách phòng' });
  }
}

export async function getOrCreateRoom(req, res) {
  try {
    const shopId = req.body.shopId ?? req.body.data?.shopId;

    console.log('✅ shopId:', shopId);
    if (!shopId) {
      return res.status(400).json({ message: 'Missing shopId' });
    }

    const room = await chatSrv.getOrCreateRoom(req.user._id, shopId);
    return res.json(room);
  } catch (err) {
    console.error('❌ getOrCreateRoom Error:', err);
    if (err.message === 'SHOP_NOT_FOUND')
      return res.status(404).json({ message: 'Shop not found' });
    return res.status(500).json({ message: err.message || 'Server error' });
  }
}

export async function getMessages(req, res) {
  const msgs = await chatSrv.findMessages(req.params.roomId);
  res.json(msgs);
}

export async function sendMessage(req, res) {
  try {
    console.log('📥 params:', req.params);
    console.log('📥 body:', req.body);

    const { roomId } = req.params;
    // ghép body.data (Postman) hoặc body thẳng
    const body = req.body.data || req.body;
    const { content, shopId } = body;

    // ← Thêm 2 dòng này:
    const userId = req.user?._id;
    const userRoles = req.user?.roles || [];

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!roomId && !shopId)
      return res.status(400).json({ message: 'Missing roomId or shopId' });
    if (!content?.trim())
      return res.status(400).json({ message: 'Content is required' });

    // …phần load room, xác định senderType, tạo message, v.v.
  } catch (err) {
    console.error('🔥 SendMessage error:', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
}

export async function getRoomsByShop(req, res) {
  try {
    const rooms = await chatSrv.findAllRoomsByShop(req.user._id); // ✅
    console.log('🧪 Trả về room shop:', rooms);
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
export async function getRoomsByShopId(req, res) {
  try {
    const shopId = req.params.shopId;

    if (!shopId) {
      return res.status(400).json({ message: 'Missing shopId in params' });
    }

    const rooms = await ChatRoom.find({ shopId })
      .populate('userId', 'name avatar email')
      .populate('shopId', 'name avatar')
      .sort({ lastMessageTime: -1 });

    return res.json(rooms);
  } catch (err) {
    console.error('❌ Lỗi lấy rooms theo shopId:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
