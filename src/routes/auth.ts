import express, { NextFunction, Router, Response, Request, RequestHandler } from "express";
import { login, loginGet, loginVerifyAndAddContext, wrapHandlerContext } from "../controllers/auth";

const router : Router = Router();


router.post("/login", 
    login,
);


router.get( "/login",
    loginVerifyAndAddContext,
    wrapHandlerContext(loginGet),
)

export default router;