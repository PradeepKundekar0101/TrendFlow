import express from "express";
import { buyYes, sellYes, buyNo, sellNo, mintTokens } from "../controller/order";

export const orderRouter = express.Router();

orderRouter.post("/buy/yes", buyYes);
orderRouter.post("/sell/yes", sellYes);
orderRouter.post("/buy/no", buyNo);
orderRouter.post("/sell/no", sellNo);
orderRouter.post("/mint", mintTokens);