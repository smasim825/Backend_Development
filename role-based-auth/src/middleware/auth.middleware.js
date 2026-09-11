const jwt = require("jsonwebtoken");

async function authArtist(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "Forbidden: You don't have access. Only artists can perform this action."
            });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized: Invalid or expired token"
        });
    }
}

async function authUser(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "user") {
            return res.status(403).json({
                message: "Forbidden: You don't have access. This endpoint is only for regular users."
            });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
}

module.exports = { authArtist, authUser };