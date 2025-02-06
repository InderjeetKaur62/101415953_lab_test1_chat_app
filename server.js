const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('../routes/authRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const server = http.createServer(app);

const io = socketIo(server);
app.use(cors());
app.use(express.json());

// Socket.io events
let users = {}; // To store users in rooms

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Handle sending a message
  socket.on('sendMessage', async ({ room, message }) => {
    // Save the message to MongoDB
    const newMessage = new Message({ from_user: socket.id, room, message });
    await newMessage.save();

    // Emit message to the room
    io.to(room).emit('message', newMessage);
  });

  // Handle typing notification
  socket.on('typing', (room) => {
    socket.broadcast.to(room).emit('typing', socket.id);
  });

  // Disconnect the user
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Server running on port 5000');
});