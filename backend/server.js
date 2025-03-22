const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const ebookRoutes = require('./routes/api/ebooks');
const adminRoutes = require('./routes/api/admin');
const publisherRoutes = require('./routes/publisherRoutes');
const connectDB = require('./config/db');
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads/covers', express.static(path.join(__dirname, 'uploads', 'covers')));

// Use this to allow both origins
app.use(cors({
    origin: ['http://localhost:3000', 'https://hub.ranobe.vn']
}));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/ebooks', ebookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/publishers', publisherRoutes);

// Serve reader
app.use('/reader', express.static(path.join(__dirname, 'reader')));

app.use('/uploads/ebooks', (req, res, next) => {
    const referer = req.get('referer');
    if (!referer) {
        return res.status(403).sendFile(path.join(__dirname, 'error', '403.html'));
    }
    try {
        const refererUrl = new URL(referer);
        const host = req.get('host');
        if (refererUrl.host === host && (refererUrl.pathname.startsWith('/reader') || refererUrl.pathname.startsWith('/admin'))) {
            return express.static(path.join(__dirname, 'uploads', 'ebooks'))(req, res, next);
        }
    } catch (error) {
        console.error('Invalid referer URL:', error);
    }
    res.status(403).sendFile(path.join(__dirname, 'error', '403.html'));
});

app.get('/reader', (req, res, next) => {
    if (req.query.book) {
        return res.sendFile(path.join(__dirname, 'reader', 'index.html'));
    }
    next();
});

app.get('/reader/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'reader', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});