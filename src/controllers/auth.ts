import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { generateJwt, verifyJwt } from "../services/auth";
import { verify } from "crypto";
import cookieParser from "cookie-parser";
import { pool } from "../services/database";
import { QueryResult } from "pg";

export const login = async function (req : Request, res : Response, next : NextFunction) : Promise<void> {
    console.log(req.body);
    if (!req.body) {
        console.log("Unable to login user: Missing username or password")
        res.sendStatus(422);
        return;
    }

    const username : string | undefined = req.body.username
    const password : string | undefined = req.body.password

    if (!username || !password) {
        console.log("Unable to login user: Missing username or password")
        res.sendStatus(422);
        return;
    }

    const queryRes : QueryResult = await pool.query("SELECT * FROM users WHERE uniqueuser = $1 AND passwd = $2", [username, password]);
    
    if (queryRes.rows.length == 0) {
        res.status(401).send("Unable to login");
        return;
    }

    const token : string = await generateJwt(req);
    res.setHeader("Set-Cookie", `authtoken=${token}; Secure; HttpOnly`);
    res.send("Login successful");
    next();
}

export const loginVerify = async function (req : Request, res : Response, next : NextFunction) {
    console.log(req.cookies)
    let verifier = await verifyJwt(req.cookies.authtoken);

    if (!verifier.ok) {
        let err : Error = verifier.err!
        console.log("The error was: " + err.name);
        res.status(403).send("<h1>Unable to access resource</h1>");
        return;
    }

    res.locals.jwt = verifier.jwt!
    res.locals.repo = (verifier.jwt!.payload as jwt.JwtPayload).repo
    next();
}

export const loginGet = async function (req : Request, res : Response, next : NextFunction) {
    res.send(`Successfuly log in! <br> ${res.locals.repo as string}`);
    next();
}