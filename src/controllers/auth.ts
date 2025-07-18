import { NextFunction, Request, Response } from "express";
import { generateJwt } from "../services/auth";

export const login = function (req : Request, res : Response, next : NextFunction) {
    const token : string = generateJwt(req);
    res.send(token);
    next();
}