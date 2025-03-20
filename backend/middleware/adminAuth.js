module.exports = function (req, res, next) {
    const adminToken = req.header('x-admin-token');

    if (!adminToken) {
        return res.status(401).json({ msg: 'Không có quyền truy cập' });
    }

    // Mật khẩu admin cố định đơn giản
    if (adminToken !== 'admin-secure-password-123') {
        return res.status(401).json({ msg: 'Token không hợp lệ' });
    }

    next();
};