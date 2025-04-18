const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const logger = require("../utils/logger");
const CircuitBreaker = require("circuit-breaker-js");

// Initialize Circuit Breaker
const authCircuitBreaker = new CircuitBreaker({
  timeoutDuration: 3000, // Timeout after 3 seconds
  errorThresholdPercentage: 50, // Trip after 50% failure rate
  resetTimeout: 30000, // Wait 30 seconds before trying to close circuit
});

// Event listeners for monitoring
authCircuitBreaker.on("open", () => {
  logger.error("Circuit breaker OPEN - Auth service unavailable");
});

authCircuitBreaker.on("halfOpen", () => {
  logger.warn("Circuit breaker HALF-OPEN - Testing auth service recovery");
});

authCircuitBreaker.on("close", () => {
  logger.info("Circuit breaker CLOSED - Auth service available");
});

const authMiddleware = (requiredRoles = []) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      logger.warn("Authentication failed - No token provided");
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Authentication required",
      });
    }

    try {
      // Wrap the auth service call with circuit breaker
      const authResponse = await authCircuitBreaker.run(async () => {
        return axios.get(
          `${process.env.AUTH_SERVICE_URL}/api/auth/verify-token`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 2500, // Individual request timeout (should be < circuit timeout)
          }
        );
      });

      // Check if token is valid and contains required data
      if (!authResponse.data.valid || !authResponse.data.user) {
        throw new Error("Invalid token response");
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

      next();
    } catch (error) {
      logger.error(`Authentication error: ${error.message}`);

      // Handle circuit breaker specific errors
      if (authCircuitBreaker.isOpen()) {
        return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
          error: "Authentication service temporarily unavailable",
          details: "Please try again later",
        });
      }

      // Handle axios specific errors
      if (error.response?.status === StatusCodes.UNAUTHORIZED) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: "Invalid authentication token",
        });
      }

      // Handle request timeouts
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
