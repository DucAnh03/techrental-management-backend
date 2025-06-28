import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';

import connectDB from './src/config/database.js';
import { v2 as cloudinary } from 'cloudinary';
import router from './src/routes/index.js';
// import productRoutes from './src/routes/productRoutes.js';
import { Server as SocketIOServer } from 'socket.io';
import passport from './src/config/passport.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
import cron from 'node-cron';
import { autoUpdateOrderStatus } from './src/service/order.service.js';

cron.schedule('0 0 * * *', async () => {
  console.log('Running auto update order status job');
  await autoUpdateOrderStatus();
});
connectDB().catch((error) => {
  console.error('❌ Failed to connect to MongoDB:', error.message);
  process.exit(1);
});
const allowedOrigins = [
  'http://localhost:3000',
  'https://techrental.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/api', router);
// Route test server
app.get('/', (req, res) => {
  console.log('heee');
  res.json({ message: 'Welcome to Techrental API' });
});
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.set('io', io); // <- để controller dùng: req.app.get('io')

io.on('connection', (socket) => {
  console.log('🔌  Socket connected:', socket.id);

  socket.on('joinRoom', (roomId) => socket.join(roomId));

  socket.on('chatMessage', ({ roomId, message }) => {
    socket.to(roomId).emit('newMessage', message);
  });

  socket.on('disconnect', () =>
    console.log('❌  Socket disconnected:', socket.id)
  );
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
