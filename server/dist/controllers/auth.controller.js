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
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = require("../index");
const config_1 = __importDefault(require("../config/config"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        // Check if the user already exists
        const existingUser = yield index_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 12);
        // Create the user
        const user = yield index_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        // Generate a JWT token
        const jwtSecret = config_1.default.jwtSecret;
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret, {
            expiresIn: '7d' // Hardcode the expiration as a simple solution
        });
        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Error registering user.' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if the user exists
        const user = yield index_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        // Verify the password
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        // Generate a JWT token
        const jwtSecret = config_1.default.jwtSecret;
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret, {
            expiresIn: '7d' // Hardcode the expiration as a simple solution
        });
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Error during login.' });
    }
});
exports.login = login;
