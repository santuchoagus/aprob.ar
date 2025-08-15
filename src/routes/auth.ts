import express, { NextFunction, Router, Response, Request } from "express";
import { login, loginVerify, loginGet } from "../controllers/auth";

const router : Router = Router();


router.post("/login", login);


router.get("/login", loginVerify, loginGet)

export default router;