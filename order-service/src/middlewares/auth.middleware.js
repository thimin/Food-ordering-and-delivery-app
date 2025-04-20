const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const logger = require("../utils/logger");
const CircuitBreaker = require("opossum");

// Initialize Circuit Breaker with opossum
const breakerOptions = {
  timeout: 3000, // Timeout individual requests after 3 seconds
  errorThresholdPercentage: 50, // Trip circuit after 50% failure rate
  resetTimeout: 30000, // Wait 30 seconds before attempting to close circuit
};

const authServiceCall = async (token) => {
  return axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/verify-token`, {
    headers: { Authorization: `Bearer ${token}` },
    timeout: 2500, // Slightly less than circuit breaker timeout
  });
};

const authCircuitBreaker = new CircuitBreaker(authServiceCall, breakerOptions);

// Circuit Breaker event listeners
authCircuitBreaker.on("open", () => {
  logger.error("Auth Service Circuit Breaker: Open - Requests failing");
});

authCircuitBreaker.on("halfOpen", () => {
  logger.warn("Auth Service Circuit Breaker: Half-Open - Testing recovery");
});

authCircuitBreaker.on("close", () => {
  logger.info(
    "Auth Service Circuit Breaker: Closed - Requests flowing normally"
  );
});

authCircuitBreaker.on("failure", (err) => {
  logger.warn(`Auth Service call failed: ${err.message}`);
});

authCircuitBreaker.on("success", () => {
  logger.debug("Auth Service call succeeded");
});

// Main middleware function
const authMiddleware = (requiredRoles = []) => {
  return async (req, res, next) => {
    // Skip auth if in development mode
    if (
      process.env.SKIP_AUTH === "true" &&
      process.env.NODE_ENV !== "production"
    ) {
      logger.warn("⚠️  Authentication bypassed (SKIP_AUTH=true)");
      // req.user = {
      //   id: "dev_user_123",
      //   role: "admin",
      //   email: "dev@example.com",
      // };
      return next();
    }

    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      logger.warn("Authentication failed - No token provided");
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Authentication required",
      });
    }

    try {
      // Use circuit breaker to call auth service
      const authResponse = await authCircuitBreaker.fire(token);

      // Validate response
      if (!authResponse.data.valid || !authResponse.data.user) {
        throw new Error("Invalid token response from auth service");
      }

      req.user = authResponse.data.user;

      // Role-based authorization
      if (
        requiredRoles.length > 0 &&
        !requiredRoles.includes(authResponse.data.user.role)
      ) {
        logger.warn(
          `Forbidden access attempt by user ${authResponse.data.user.id}`
        );
        return res.status(StatusCodes.FORBIDDEN).json({
          error: "Insufficient permissions",
        });
      }

      logger.debug(`Authenticated user ${authResponse.data.user.id}`);
      next();
    } catch (error) {
      logger.error(`Authentication error: ${error.message}`);

      // Handle different error cases
      if (authCircuitBreaker.opened) {
        return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
          error: "Authentication service temporarily unavailable",
          details: "Circuit breaker tripped",
        });
      }

      if (error.response?.status === StatusCodes.UNAUTHORIZED) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: "Invalid authentication token",
        });
      }

      if (error.code === "ECONNABORTED") {
        return res.status(StatusCodes.GATEWAY_TIMEOUT).json({
          error: "Authentication service timeout",
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Authentication service error",
      });
    }
  };
};

module.exports = authMiddleware;
