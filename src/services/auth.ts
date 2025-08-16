import * as jwt from "jsonwebtoken";
import { Request } from "express";


const alg : jwt.Algorithm = "HS256";
const secret : jwt.PrivateKey = process.env.JWT_SECRET!;

export interface RequestWithContext extends Request {
    jwt : jwt.Jwt
}

export const generateJwt = async function(req :  Request): Promise<string> {
    // Fields guaranteed to exist by previous middleware
    const username : string = req.body.username;
    
    const header : jwt.JwtHeader = {
        alg: alg,
    };

    const payload : jwt.JwtPayload = {
        username: username,
        subscription: "default",
        exp: Math.floor(Date.now() / 1000) + (1 * 60),
    };

    const options : jwt.SignOptions = {
        algorithm: alg,
        header: header,
    };

    
    return jwt.sign(payload, secret, options);
}

export const verifyAndDecodeJwt = async function (jwtToken : string) : Promise<jwt.Jwt> {
    return new Promise<jwt.Jwt>(async function (resolve, reject) {
        try {
            const decodedJwt : jwt.Jwt = jwt.verify(jwtToken, secret, {algorithms: [alg], complete: true});
            resolve(decodedJwt);
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) err = Error("TokenExpiredError");
            if (err instanceof jwt.NotBeforeError) err = Error("TokenNotActiveError");
            if (err instanceof jwt.JsonWebTokenError) err = Error("JsonWebTokenError");
            reject(err);
        }
    });
};
