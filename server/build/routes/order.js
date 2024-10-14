"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = __importDefault(require("express"));
const order_1 = require("../controller/order");
exports.orderRouter = express_1.default.Router();
exports.orderRouter.post("/buy/yes", order_1.buyYes);
exports.orderRouter.post("/sell/yes", order_1.sellYes);
exports.orderRouter.post("/buy/no", order_1.buyNo);
exports.orderRouter.post("/sell/no", order_1.sellNo);
exports.orderRouter.post("/mint", order_1.mintTokens);
