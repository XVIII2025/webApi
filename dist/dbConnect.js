"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryPromise = exports.conn = void 0;
const mysql_1 = __importDefault(require("mysql"));
const util_1 = __importDefault(require("util"));
exports.conn = mysql_1.default.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "apihw5",
    password: "apihw5",
    database: "webapi"
});
exports.queryPromise = util_1.default.promisify(exports.conn.query).bind(exports.conn);
