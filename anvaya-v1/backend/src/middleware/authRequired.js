// middleware/authRequired.js

const { requireAuth } = require('@clerk/express');

/**
 * Clerk authentication middleware.
 * Ensures the request has a valid Clerk session.
 * Automatically responds with 401 Unauthorized if no valid session.
 * Adds req.auth containing Clerk session and user info.
 */

module.exports = requireAuth();
