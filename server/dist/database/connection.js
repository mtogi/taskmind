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
exports.closeConnection = exports.testConnection = exports.supabase = exports.pool = void 0;
const pg_1 = require("pg");
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = __importDefault(require("../config/config"));
// PostgreSQL connection pool
exports.pool = new pg_1.Pool({
    connectionString: config_1.default.databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
// Supabase client for additional features
exports.supabase = (0, supabase_js_1.createClient)(config_1.default.supabaseUrl, config_1.default.supabaseServiceKey);
// Test database connection
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield exports.pool.connect();
        yield client.query('SELECT NOW()');
        client.release();
        console.log('✅ Database connection successful');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
});
exports.testConnection = testConnection;
// Graceful shutdown
const closeConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.pool.end();
    console.log('Database connection closed');
});
exports.closeConnection = closeConnection;
