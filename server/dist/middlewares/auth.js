"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const queries_1 = require("../database/queries");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required. No token provided.' });
        }
        // Extract the token
        const token = authHeader.split(' ')[1];
        // Special handling for test account with mock token
        if (token === 'mock-jwt-token-for-testing') {
            // For test account, find the user by email
            const testUser = yield queries_1.userQueries.findByEmail('test@taskmind.dev');
            if (!testUser) {
                return res.status(401).json({ message: 'Test user not found.' });
            }
            // Add the user to the request object
            req.user = { id: testUser.id };
            next();
            return;
        }
        // Regular JWT verification for real tokens
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        // Check if the user exists
        const user = yield queries_1.userQueries.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }
        // Add the user to the request object
        req.user = { id: user.id };
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
});
exports.authenticate = authenticate;
