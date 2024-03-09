"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const dbConnect_1 = require("../dbConnect");
const mysql_1 = __importDefault(require("mysql"));
exports.router = express_1.default.Router();
exports.router.post("/", (req, res) => {
    if (req.body) {
        let Creator = req.body;
        let sql = "insert into `creators`(`mid`, `pid`) VALUES (?,?)";
        sql = mysql_1.default.format(sql, [
            Creator.mid,
            Creator.pid
        ]);
        dbConnect_1.conn.query(sql, (err, result) => {
            if (err)
                throw err;
            res.status(201).json({ affected_row: result.affectedRows, last_idx: result.insertId });
        });
    }
});
exports.router.delete("/", (req, res) => {
    if (req.query.cid) {
        const cid = req.query.cid;
        let sql = 'delete from creators where cid = ?';
        dbConnect_1.conn.query(sql, [cid], (err, result) => {
            if (err)
                throw err;
            res.status(200).json({
                affected_row: result.affectedRows
            });
        });
    }
});
