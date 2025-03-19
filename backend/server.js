const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use('/reader', express.static(path.join(__dirname, 'reader')));

app.use('/bookshelf', (req, res, next) => {
    const referer = req.get('referer');

    if (referer && referer.includes('/reader')) {
        express.static(path.join(__dirname, 'bookshelf'))(req, res, next);
    } else {
        res.status(403).redirect('/reader');
    }
});

app.get('/reader', (req, res, next) => {
    if (req.query.book) {
        return res.sendFile(path.join(__dirname, 'reader', 'index.html'));
    }
    next();
});

app.get('/', (req, res) => {
    res.redirect('https://ranobe.vn');
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});