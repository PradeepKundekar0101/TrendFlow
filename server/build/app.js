"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const balance_1 = require("./routes/balance");
const user_1 = require("./routes/user");
const onramp_1 = require("./routes/onramp");
const symbol_1 = require("./routes/symbol");
const orderBook_1 = require("./routes/orderBook");
const order_1 = require("./routes/order");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send("Options Trading App");
});
app.use('/api/v1/balance', balance_1.balanceRouter);
app.use('/api/v1/orderbook', orderBook_1.orderBookRouter);
app.use('/api/v1/user', user_1.userRouter);
app.use('/api/v1/onramp', onramp_1.onrampRouter);
app.use('/api/v1/symbol', symbol_1.symbolRouter);
app.use('/api/v1/order', order_1.orderRouter);
exports.default = app;
