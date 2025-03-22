const mongoose = require('mongoose');

const EbookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    illustrator: {
        type: String,
        default: 'Unknown'
    },
    coverImage: {
        type: String,
        default: 'default-cover.jpg'
    },
    filePath: {
        type: String,
        required: true
    },
    originalFileName: {
        type: String,
        default: ''
    },
    releaseDate: {
        type: Date,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ebook', EbookSchema);