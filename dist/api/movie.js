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
        let movie = req.body;
        let sql = "insert into `movie`(`name`, `detail`) VALUES (?,?)";
        sql = mysql_1.default.format(sql, [
            movie.name,
            movie.detail
        ]);
        dbConnect_1.conn.query(sql, (err, result) => {
            if (err)
                throw err;
            res.status(201).json({ affected_row: result.affectedRows, last_idx: result.insertId });
        });
    }
});
exports.router.delete("/", (req, res) => {
    if (req.query.mid) {
        const mid = req.query.mid;
        let sql = 'delete from movie where mid = ?';
        dbConnect_1.conn.query(sql, [mid], (err, result) => {
            if (err)
                throw err;
            res.status(200).json({
                affected_row: result.affectedRows
            });
        });
    }
});
exports.router.get("/", (req, res) => {
    const movieName = req.query.movieName;
    let sql = 'SELECT * FROM movie WHERE name LIKE ?';
    sql = mysql_1.default.format(sql, [`%${movieName}%`]);
    dbConnect_1.conn.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        else {
            const movies = result;
            // Extract mid values from movies
            const midValues = movies.map((movie) => movie.mid);
            // Use midValues for further processing
            const creatorsSql = 'SELECT * FROM creators WHERE mid IN (?)';
            const starsSql = 'SELECT * FROM stars WHERE mid IN (?)';
            const creatorsSqlFormatted = mysql_1.default.format(creatorsSql, [midValues]);
            const starsSqlFormatted = mysql_1.default.format(starsSql, [midValues]);
            // Query creators and stars based on midValues
            dbConnect_1.conn.query(creatorsSqlFormatted, (creatorsErr, creatorsResult) => {
                if (creatorsErr) {
                    console.error(creatorsErr);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
                else {
                    // creatorsResult contains data from creators table
                    console.log('Creators:', creatorsResult);
                    // Query stars based on midValues
                    dbConnect_1.conn.query(starsSqlFormatted, (starsErr, starsResult) => {
                        if (starsErr) {
                            console.error(starsErr);
                            res.status(500).json({ error: 'Internal Server Error' });
                        }
                        else {
                            // starsResult contains data from stars table
                            console.log('Stars:', starsResult);
                            // Extract pids from creatorsResult and starsResult
                            const creatorPids = creatorsResult.map((creator) => creator.pid);
                            const starsPids = starsResult.map((star) => star.pid);
                            // Combine pids from creators and stars
                            const allPids = [...new Set([...creatorPids, ...starsPids])];
                            // Query person table based on pids
                            const personSql = 'SELECT * FROM person WHERE pid IN (?)';
                            const personSqlFormatted = mysql_1.default.format(personSql, [allPids]);
                            dbConnect_1.conn.query(personSqlFormatted, (personErr, personResult) => {
                                if (personErr) {
                                    console.error(personErr);
                                    res.status(500).json({ error: 'Internal Server Error' });
                                }
                                else {
                                    // personResult contains data from person table
                                    console.log('Person:', personResult);
                                    res.status(200).json({ movies, creators: creatorsResult, stars: starsResult, persons: personResult });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});
