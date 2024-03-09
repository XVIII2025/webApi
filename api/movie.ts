import express from "express";
import { conn, queryPromise } from "../dbConnect";
import mysql from "mysql"
import { Movie } from "./model/movie_Res";

export const router = express.Router();

router.post("/", (req, res) => {
    if (req.body) {
        let movie: Movie = req.body;
        let sql = 
        "insert into `movie`(`name`, `detail`) VALUES (?,?)";

        sql = mysql.format(sql, [
            movie.name,
            movie.detail
          ]);
        conn.query(sql, (err, result) => {
            if (err) throw err;
            res.status(201).json({ affected_row: result.affectedRows, last_idx: result.insertId });
        });
    }
});

router.delete("/", (req, res) => {
    if (req.query.mid) {
        const mid = req.query.mid;
        let sql = 'delete from movie where mid = ?';
        conn.query(sql, [mid], (err, result)=>{
            if (err) throw err;
            res.status(200).json({
                affected_row : result.affectedRows
            });
        });
    }
});

router.get("/", (req, res) => {
    const movieName = req.query.movieName;

    let sql = 'SELECT * FROM movie WHERE name LIKE ?';
    sql = mysql.format(sql, [`%${movieName}%`]);

    conn.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const movies = result;

            // Extract mid values from movies
            const midValues = movies.map((movie: { mid: any; }) => movie.mid);

            // Use midValues for further processing
            const creatorsSql = 'SELECT * FROM creators WHERE mid IN (?)';
            const starsSql = 'SELECT * FROM stars WHERE mid IN (?)';

            const creatorsSqlFormatted = mysql.format(creatorsSql, [midValues]);
            const starsSqlFormatted = mysql.format(starsSql, [midValues]);

            // Query creators and stars based on midValues
            conn.query(creatorsSqlFormatted, (creatorsErr, creatorsResult) => {
                if (creatorsErr) {
                    console.error(creatorsErr);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    // creatorsResult contains data from creators table
                    console.log('Creators:', creatorsResult);

                    // Query stars based on midValues
                    conn.query(starsSqlFormatted, (starsErr, starsResult) => {
                        if (starsErr) {
                            console.error(starsErr);
                            res.status(500).json({ error: 'Internal Server Error' });
                        } else {
                            // starsResult contains data from stars table
                            console.log('Stars:', starsResult);

                            // Extract pids from creatorsResult and starsResult
                            const creatorPids = creatorsResult.map((creator: { pid: any; }) => creator.pid);
                            const starsPids = starsResult.map((star: { pid: any; }) => star.pid);

                            // Combine pids from creators and stars
                            const allPids = [...new Set([...creatorPids, ...starsPids])];

                            // Query person table based on pids
                            const personSql = 'SELECT * FROM person WHERE pid IN (?)';
                            const personSqlFormatted = mysql.format(personSql, [allPids]);

                            conn.query(personSqlFormatted, (personErr, personResult) => {
                                if (personErr) {
                                    console.error(personErr);
                                    res.status(500).json({ error: 'Internal Server Error' });
                                } else {
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

