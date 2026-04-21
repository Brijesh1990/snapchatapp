const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Socket.IO Logic
let activeUsers = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('addUser', (userId) => {
        if (userId && !activeUsers.some(user => user.userId === userId)) {
            activeUsers.push({ userId, socketId: socket.id });
        }
        io.emit('getUsers', activeUsers);
    });

    socket.on('sendMessage', ({ senderId, receiverId, text, image, video }) => {
        const user = activeUsers.find(user => user.userId === receiverId);
        if (user) {
            io.to(user.socketId).emit('getMessage', {
                senderId,
                text,
                image,
                video
            });
        }
    });

    socket.on('typing', ({ senderId, receiverId }) => {
        const user = activeUsers.find(user => user.userId === receiverId);
        if (user) {
            io.to(user.socketId).emit('typingStatus', { senderId });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        activeUsers = activeUsers.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', activeUsers);
    });
});

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const storyRoutes = require('./routes/stories');
const messageRoutes = require('./routes/messages');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/messages', messageRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
