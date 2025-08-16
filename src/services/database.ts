import { Pool, QueryResult } from "pg";
import * as jwt from "jsonwebtoken";

if(!process.env.PG_USER || !process.env.PG_HOST) {
    throw Error("Missing PG environment variables in .env file");
}

export const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD || "",
    database: "aprobdb",
    port: (process.env.PG_PORT || 5432) as number,
});

export interface UserInfo {
    username : string,
    firstname? : string,
    surname? : string,
    email? : string,
}

export const getUserInfo = async function (token : jwt.Jwt) : Promise<UserInfo> {
    const payload = token.payload as jwt.JwtPayload;
    const queryRes : QueryResult = await pool.query("SELECT * FROM users WHERE uniqueuser = $1", [payload.username]);
    
    if (queryRes.rowCount == 0) {
        throw Error("UserDoesNotExist");
    }

    const onlyRow = queryRes.rows[0];

    return {
        username: onlyRow.uniqueuser,
        ...(onlyRow.firstname && {firstname: onlyRow.firstname}),
        ...(onlyRow.surname && {surname: onlyRow.surname}),
        ...(onlyRow.email && {email: onlyRow.email}),
    }
}