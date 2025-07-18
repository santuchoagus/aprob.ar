import express, { Router } from "express";
import { login } from "../controllers/auth";

const router : Router = Router();

router.get("/login", login);

export default router;