const express = require('express');
const router = express.Router();

// @route   POST api/admin/login
// @desc    Đăng nhập admin
// @access  Public
router.post('/login', (req, res) => {
    const { password } = req.body;

    // Kiểm tra mật khẩu đơn giản
    if (password === 'admin-secure-password-123') {
        res.json({
            token: 'admin-secure-password-123'
        });
    } else {
        res.status(401).json({ msg: 'Mật khẩu không đúng' });
    }
});

module.exports = router;