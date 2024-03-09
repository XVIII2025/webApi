import mysql from "mysql";
import util from "util";

export const conn = mysql.createPool(
    {
        connectionLimit: 10,
        host: "localhost",
        user: "apihw5",
        password: "apihw5",
        database: "webapi"
    }
);
export const queryPromise = util.promisify(conn.query).bind(conn);