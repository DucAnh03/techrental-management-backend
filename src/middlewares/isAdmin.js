export default function isAdmin(req, res, next) {
    if (req.user && Array.isArray(req.user.roles) && req.user.roles.includes('admin')) {
        return next();
    }
    return res.status(403).json({ message: 'Bạn không có quyền truy cập.' });
} 