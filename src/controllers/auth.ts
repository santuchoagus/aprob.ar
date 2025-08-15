import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { generateJwt, verifyJwt } from "../services/auth";
import { verify } from "crypto";
import cookieParser from "cookie-parser";

export const login = function (req : Request, res : Response, next : NextFunction) {
    const token : string = generateJwt(req);
    res.setHeader("Set-Cookie", `authtoken=${token}; Secure; HttpOnly`);
    res.send();
    next();
}

export const loginVerify = function (req : Request, res : Response, next : NextFunction) {
    console.log(req.cookies)
    let verifier = verifyJwt(req.cookies.authtoken);

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

export const loginGet = function (req : Request, res : Response, next : NextFunction) {
    res.send(`Successfuly log in! <br> ${res.locals.repo as string}`);
    next();
}