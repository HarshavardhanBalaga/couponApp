const jwt = require('jsonwebtoken');

function adminAuth(req, res, next) {
    const token = req.cookies?.admin_token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.id;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token invalid or expired' });
    }
}

module.exports = adminAuth;
