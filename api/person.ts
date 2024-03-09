import express from "express";
import { conn, queryPromise } from "../dbConnect";
import mysql from "mysql"
import { Person } from "./model/person_Res";

export const router = express.Router();

router.post("/", (req, res) => {
    if (req.body) {
        let Person: Person = req.body;
        let sql = 
        "insert into `Person`(`name`, `age`) VALUES (?,?)";

        sql = mysql.format(sql, [
            Person.name,
            Person.age
          ]);
        conn.query(sql, (err, result) => {
            if (err) throw err;
            res.status(201).json({ affected_row: result.affectedRows, last_idx: result.insertId });
        });
    }
});

router.delete("/", (req, res) => {
    if (req.query.pid) {
        const pid = req.query.pid;
        let sql = 'delete from person where pid = ?';
        conn.query(sql, [pid], (err, result)=>{
            if (err) throw err;
            res.status(200).json({
                affected_row : result.affectedRows
            });
        });
    }
});
