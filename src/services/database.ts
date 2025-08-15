import { Pool } from "pg";

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