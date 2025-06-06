import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Optional: Validate decoded structure
        if (!decoded?.userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }

        req.id = decoded.userId;
        next();

    } catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(401).json({
            success: false,
            message: "Token verification failed"
        });
    }
};
