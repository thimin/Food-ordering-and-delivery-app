// Dummy middleware to simulate restaurant role
module.exports = (req, res, next) => {
    // In real app, verify token and check role
    next();
    };
    