import express from "express"
import { createSymbol } from "../controller/symbol";

export const symbolRouter = express.Router();

symbolRouter.post("/create/:stockSymbol",createSymbol);