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
export const restaurantValidator = async (req, res, next) => {
    try {
        const role = req.user?.role;

        if (role !== "restaurant") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Restaurant role required."
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

export const deliveryValidator = async (req, res, next) => {
    try {
        const role = req.user?.role;

        if (role !== "restaurant") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Delivery role required."
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

export const superadminValidator = async (req, res, next) => {
    try {
        const role = req.user?.role;

        if (role !== "restaurant") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Superadmin role required."
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

