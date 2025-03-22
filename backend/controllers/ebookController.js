const Ebook = require('../models/Ebook');
const path = require('path');
const fs = require('fs');

// Lấy tất cả ebook
exports.getAllEbooks = async (req, res) => {
    try {
        const ebooks = await Ebook.find().select('-__v');
        res.json(ebooks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi server');
    }
};

// Lấy ebook theo ID
exports.getEbookById = async (req, res) => {
    try {
        const ebook = await Ebook.findById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ msg: 'Không tìm thấy ebook' });
        }
        res.json(ebook);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Không tìm thấy ebook' });
        }
        res.status(500).send('Lỗi server');
    }
};

// Tạo ebook mới
exports.createEbook = async (req, res) => {
    try {
        const { name, author, illustrator, releaseDate, publisher } = req.body;

        // Kiểm tra file upload
        if (!req.files || !req.files.cover || !req.files.ebook) {
            return res.status(400).json({ msg: 'Cần upload cả cover và file ebook' });
        }

        const coverFile = req.files.cover[0];
        const ebookFile = req.files.ebook[0];

        const originalFileName = req.originalFilenames?.ebook || ebookFile.originalname;

        const newEbook = new Ebook({
            name,
            author,
            illustrator: illustrator || 'Unknown',
            coverImage: coverFile.filename,
            filePath: ebookFile.filename,
            originalFileName: originalFileName,
            releaseDate,
            publisher
        });

        const ebook = await newEbook.save();
        res.json(ebook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi server');
    }
};

// Cập nhật ebook
exports.updateEbook = async (req, res) => {
    try {
        const { name, author, illustrator, releaseDate, publisher } = req.body;

        const ebookFields = {
            name,
            author,
            illustrator,
            releaseDate,
            publisher,
            updatedAt: Date.now()
        };

        // Kiểm tra nếu có file cover mới
        if (req.files && req.files.cover) {
            const coverFile = req.files.cover[0];
            ebookFields.coverImage = coverFile.filename;

            // Xóa file cover cũ
            const oldEbook = await Ebook.findById(req.params.id);
            if (oldEbook && oldEbook.coverImage !== 'default-cover.jpg') {
                const oldPath = path.join(__dirname, '../uploads/covers', oldEbook.coverImage);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        // Kiểm tra nếu có file ebook mới
        if (req.files && req.files.ebook) {
            const ebookFile = req.files.ebook[0];
            ebookFields.filePath = ebookFile.filename;

            // Xóa file ebook cũ
            const oldEbook = await Ebook.findById(req.params.id);
            if (oldEbook) {
                const oldPath = path.join(__dirname, '../uploads/ebooks', oldEbook.filePath);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        let ebook = await Ebook.findById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ msg: 'Không tìm thấy ebook' });
        }

        ebook = await Ebook.findByIdAndUpdate(
            req.params.id,
            { $set: ebookFields },
            { new: true }
        );

        res.json(ebook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi server');
    }
};

// Xóa ebook
exports.deleteEbook = async (req, res) => {
    try {
        const ebook = await Ebook.findById(req.params.id);
        if (!ebook) {
            return res.status(404).json({ msg: 'Không tìm thấy ebook' });
        }

        // Xóa các file đi kèm
        if (ebook.coverImage !== 'default-cover.jpg') {
            const coverPath = path.join(__dirname, '../uploads/covers', ebook.coverImage);
            if (fs.existsSync(coverPath)) {
                fs.unlinkSync(coverPath);
            }
        }

        const ebookPath = path.join(__dirname, '../uploads/ebooks', ebook.filePath);
        if (fs.existsSync(ebookPath)) {
            fs.unlinkSync(ebookPath);
        }

        await Ebook.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Ebook đã được xóa' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi server');
    }
};