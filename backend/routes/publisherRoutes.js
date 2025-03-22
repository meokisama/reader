const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publisherController');

// Lấy tất cả nhà xuất bản
router.get('/', publisherController.getAllPublishers);

// Tạo nhà xuất bản mới
router.post('/', publisherController.createPublisher);

// Cập nhật nhà xuất bản
router.put('/:id', publisherController.updatePublisher);

// Xóa nhà xuất bản
router.delete('/:id', publisherController.deletePublisher);

module.exports = router; 