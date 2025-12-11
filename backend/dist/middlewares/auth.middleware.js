import jwt from "jsonwebtoken";
export const authenticate = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No or invalid authorization header" });
    }
    const token = header.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};
//# sourceMappingURL=auth.middleware.js.map