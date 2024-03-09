import express from "express";
import { conn, queryPromise } from "../dbConnect";
import mysql from "mysql"
import { Creator } from "./model/creators_Res";

export const router = express.Router();

router.post("/", (req, res) => {
    if (req.body) {
        let Creator: Creator = req.body;
        let sql = 
        "insert into `creators`(`mid`, `pid`) VALUES (?,?)";

        sql = mysql.format(sql, [
            Creator.mid,
            Creator.pid
          ]);
        conn.query(sql, (err, result) => {
            if (err) throw err;
            res.status(201).json({ affected_row: result.affectedRows, last_idx: result.insertId });
        });
    }
});

router.delete("/", (req, res) => {
    if (req.query.cid) {
        const cid = req.query.cid;
        let sql = 'delete from creators where cid = ?';
        conn.query(sql, [cid], (err, result)=>{
            if (err) throw err;
            res.status(200).json({
                affected_row : result.affectedRows
            });
        });
    }
});

