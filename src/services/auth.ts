import * as jwt from "jsonwebtoken";
import { Request } from "express";


export const generateJwt = function(req :  Request): string {
    
    const alg : jwt.Algorithm = "HS256";
    const secret : jwt.PrivateKey = process.env.JWT_SECRET!;

    const header : jwt.JwtHeader = {
        alg: alg,
    };

    const payload : jwt.JwtPayload = {
        foo: "bar",
        repo: "github.com/santuchoagus",
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
    };

    const options : jwt.SignOptions = {
        algorithm: alg,
        header: header,
    };

    
    return jwt.sign(payload, secret, options);
}