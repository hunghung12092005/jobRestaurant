import express from "express";
import authRouter from "./authRouter.js";
import reservationRouter from "./reservationRouter.js";
import contactRouter from "./contactRouter.js";
const app = express.Router();

app.use("/auth", authRouter);
app.use("/reservation", reservationRouter);
app.use("/contact", contactRouter);

export default app;
