import express from "express";
import { conn, queryPromise } from "../dbConnect";
import mysql from "mysql"
import { Star } from "./model/stars_Res";

export const router = express.Router();

router.post("/", (req, res) => {
    if (req.body) {
        let Star: Star = req.body;
        let sql = 
        "insert into `stars`(`mid`, `pid`) VALUES (?,?)";

        sql = mysql.format(sql, [
            Star.mid,
            Star.pid
          ]);
        conn.query(sql, (err, result) => {
            if (err) throw err;
            res.status(201).json({ affected_row: result.affectedRows, last_idx: result.insertId });
        });
    }
});

router.delete("/", (req, res) => {
    if (req.query.sid) {
        const sid = req.query.sid;
        let sql = 'delete from stars where sid = ?';
        conn.query(sql, [sid], (err, result)=>{
            if (err) throw err;
            res.status(200).json({
                affected_row : result.affectedRows
            });
        });
    }
});

