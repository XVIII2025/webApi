import mysql from "mysql";
import util from "util";

export const conn = mysql.createPool(
    {
        connectionLimit: 10,
        host: "sql6.freesqldatabase.com",
        user: "sql6689895",
        password: "xka2LEHhPC",
        database: "sql6689895"
    }
);
export const queryPromise = util.promisify(conn.query).bind(conn);