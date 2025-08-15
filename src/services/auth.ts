import * as jwt from "jsonwebtoken";
import { Request } from "express";


const alg : jwt.Algorithm = "HS256";
const secret : jwt.PrivateKey = process.env.JWT_SECRET!;

export const generateJwt = function(req :  Request): string {
    const header : jwt.JwtHeader = {
        alg: alg,
    };

    const payload : jwt.JwtPayload = {
        foo: "bar",
        repo: "github.com/santuchoagus",
        exp: Math.floor(Date.now() / 1000) + (1 * 60),
    };

    const options : jwt.SignOptions = {
        algorithm: alg,
        header: header,
    };

    
    return jwt.sign(payload, secret, options);
}

export const verifyJwt = function (jwtToken : string) : {ok: boolean, jwt? : jwt.Jwt, err? : Error } {
    
    try {
        let decodedJwt : jwt.Jwt = jwt.verify(jwtToken, secret, {algorithms: [alg], complete: true});
        let decodedPayload : jwt.JwtPayload = decodedJwt.payload as jwt.JwtPayload;
        return {ok: true, jwt: decodedJwt, err: undefined};
    } catch(err) {
        return {ok: false, jwt: undefined, err: err as Error};
    }
};