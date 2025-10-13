import express from "express";
import authRouter from "./authRouter.js";
const app = express.Router();

app.use("/auth", authRouter);

export default app;
