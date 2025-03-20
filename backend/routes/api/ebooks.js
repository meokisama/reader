const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const adminAuth = require('../../middleware/adminAuth');
const ebookController = require('../../controllers/ebookController');

// Cấu hình Multer cho upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = '';
        if (file.fieldname === 'cover') {
            uploadPath = path.join(__dirname, '../../uploads/covers');
        } else if (file.fieldname === 'ebook') {
            uploadPath = path.join(__dirname, '../../uploads/ebooks');
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const newFilename = `${uuidv4()}${ext}`;

        cb(null, newFilename);

        // Lưu tên gốc vào request để có thể sử dụng sau này nếu cần
        if (!req.originalFilenames) req.originalFilenames = {};
        req.originalFilenames[file.fieldname] = file.originalname;
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'cover') {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
            }
        } else if (file.fieldname === 'ebook') {
            if (!file.originalname.match(/\.(epub|pdf)$/)) {
                return cb(new Error('Chỉ chấp nhận file .epub hoặc .pdf!'), false);
            }
        }
        cb(null, true);
    }
});

const uploadFields = upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'ebook', maxCount: 1 }
]);

// @route   GET api/ebooks
// @desc    Lấy tất cả ebook
// @access  Public
router.get('/', ebookController.getAllEbooks);

// @route   GET api/ebooks/:id
// @desc    Lấy ebook theo ID
// @access  Public
router.get('/:id', ebookController.getEbookById);

// @route   POST api/ebooks
// @desc    Tạo ebook mới
// @access  Admin
router.post('/', [adminAuth, uploadFields], ebookController.createEbook);

// @route   PUT api/ebooks/:id
// @desc    Cập nhật ebook
// @access  Admin
router.put('/:id', [adminAuth, uploadFields], ebookController.updateEbook);

// @route   DELETE api/ebooks/:id
// @desc    Xóa ebook
// @access  Admin
router.delete('/:id', adminAuth, ebookController.deleteEbook);

module.exports = router;