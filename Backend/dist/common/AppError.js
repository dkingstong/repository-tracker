"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
    static InternalServerError(message) {
        return new AppError(500, message);
    }
    static BadRequest(message) {
        return new AppError(400, message);
    }
    static Unauthorized(message) {
        return new AppError(401, message);
    }
    static NotFound(message) {
        return new AppError(404, message);
    }
    static AuthError(message) {
        return new AppError(401, message);
    }
    static ValidationError(message) {
        return new AppError(422, message);
    }
}
exports.default = AppError;
