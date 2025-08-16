import { NextFunction, Request, RequestHandler, Response } from "express";
import * as jwt from "jsonwebtoken";
import { generateJwt, RequestWithContext, verifyAndDecodeJwt } from "../services/auth";
import { verify } from "crypto";
import cookieParser from "cookie-parser";
import { getUserInfo, pool, UserInfo } from "../services/database";
import { QueryResult } from "pg";
import { throws } from "assert";
import { userInfo } from "os";

export const login = async function (req : Request, res : Response, next : NextFunction) : Promise<void> {
    const username : string | undefined = req.body?.username
    const password : string | undefined = req.body?.password

    if (!username || !password) {
        res.status(400);
        throw Error("LoginMissingUsernameOrPassword");
    }

    // Modularize later into a db controller
    const queryRes : QueryResult = await pool.query("SELECT * FROM users WHERE uniqueuser = $1 AND passwd = $2", [username, password]);
    
    // Should be placed in db controller as a wrapper function for decoupling
    if (queryRes.rows.length == 0) {
        res.status(401);
        throw Error("LoginIncorrectCredentials");
    }

    const token : string = await generateJwt(req);
    res.setHeader("Set-Cookie", `authtoken=${token}; Secure; HttpOnly`);
    res.json({status: "ok"});
    next();
}

export const loginVerifyAndAddContext = async function (req : Request, res : Response, next : NextFunction) {
    console.log(req.cookies)
    const token : string | undefined = req.cookies.authtoken;

    if (!token) {
        res.status(400);
        throw Error("AuthMissingToken");
    }

    const verifier : jwt.Jwt = await verifyAndDecodeJwt(req.cookies.authtoken);
    const reqContext : RequestWithContext = req as RequestWithContext;
    reqContext.jwt = verifier;
    
    next();
}

export const loginGet = async function (req : RequestWithContext, res : Response, next : NextFunction) {
    try {
        const user : UserInfo = await getUserInfo(req.jwt);
        res.status(200).json({status: "ok", User : user });
        next();
    } catch (e) {
        console.log(e);
        res.status(500);
        throw Error("InternalServerError");
    }
}

export const wrapHandlerContext = function (handler : (req : RequestWithContext, res : Response, next : NextFunction) => any) : RequestHandler {
    const retFunc = function (req : Request, res : Response, next : NextFunction) {
        const r = req as Partial<RequestWithContext>;
        if (!r.jwt) {
            res.status(500);
            throw Error("InternalServerError");
        }
        
        handler(r as RequestWithContext, res, next);
    }

    return retFunc;
}