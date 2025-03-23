const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

// Rate limiting cho API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Giới hạn 100 request mỗi IP trong 15 phút
    message: { msg: 'Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting cho đăng nhập
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // Giới hạn 5 lần đăng nhập thất bại
    message: { msg: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting cho upload file
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    max: 10, // Giới hạn 10 lần upload mỗi IP trong 1 giờ
    message: { msg: 'Quá nhiều lần upload file. Vui lòng thử lại sau 1 giờ.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Cấu hình Helmet
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin']
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true
});

// Middleware validate input
const validateInput = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Sanitize input
const sanitizeInput = [
    body('*').trim().escape(),
    body('*').stripLow()
];

// Middleware chặn các request nguy hiểm
const blockDangerousRequests = (req, res, next) => {
    // Chặn các request có chứa SQL injection
    const sqlInjectionPattern = /(\%27)|(\')|(\-\-)|(\%23)|(#)/i;
    if (sqlInjectionPattern.test(req.url) || sqlInjectionPattern.test(JSON.stringify(req.body))) {
        return res.status(403).json({ msg: 'Request không hợp lệ' });
    }

    // Chặn các request có chứa XSS
    const xssPattern = /<script[^>]*>[\s\S]*?<\/script>/gi;
    if (xssPattern.test(req.url) || xssPattern.test(JSON.stringify(req.body))) {
        return res.status(403).json({ msg: 'Request không hợp lệ' });
    }

    // Chặn các request có chứa path traversal
    const pathTraversalPattern = /\.\.\//;
    if (pathTraversalPattern.test(req.url)) {
        return res.status(403).json({ msg: 'Request không hợp lệ' });
    }

    next();
};

module.exports = {
    apiLimiter,
    loginLimiter,
    uploadLimiter,
    helmetConfig,
    validateInput,
    sanitizeInput,
    blockDangerousRequests
}; 