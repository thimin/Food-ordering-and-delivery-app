export const clientValidator = async (req, res, next) => {
    try {
        const role = req.user?.role;

        if (role !== "client") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Client role required."
            });
        }

        next();
    } catch (error) {
        console.error("Role validation error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during role validation."
        });
    }
};
