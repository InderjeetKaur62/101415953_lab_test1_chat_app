const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const socketHandler = require('./sockets/socketHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io connection
socketHandler(io);

// API Routes
app.get('/', (req, res) => {
    res.send('Chat Server is Running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
