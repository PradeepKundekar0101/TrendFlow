"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintTokens = exports.sellNo = exports.buyNo = exports.sellYes = exports.buyYes = void 0;
const api_util_1 = require("../utils/api.util");
const db_1 = require("../db");
const AppError_1 = __importDefault(require("../utils/AppError"));
const placeOrder = (type, option) => (0, api_util_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { userId, stockSymbol, quantity, price } = req.body;
    if (!db_1.INR_BALANCES[userId]) {
        throw new AppError_1.default(404, "User not found");
    }
    if (!db_1.ORDERBOOK[stockSymbol]) {
        throw new AppError_1.default(404, "Stock symbol not found");
    }
    const totalCost = quantity * price;
    if (type === 'buy' && db_1.INR_BALANCES[userId].balance < totalCost) {
        throw new AppError_1.default(400, "Insufficient balance");
    }
    if (type === 'sell' && (!((_b = (_a = db_1.STOCK_BALANCES[userId]) === null || _a === void 0 ? void 0 : _a[stockSymbol]) === null || _b === void 0 ? void 0 : _b[option]) ||
        db_1.STOCK_BALANCES[userId][stockSymbol][option].quantity < quantity)) {
        throw new AppError_1.default(400, "Insufficient stock balance");
    }
    if (!db_1.ORDERBOOK[stockSymbol][option][price]) {
        db_1.ORDERBOOK[stockSymbol][option][price] = { total: 0, orders: {} };
    }
    db_1.ORDERBOOK[stockSymbol][option][price].total += quantity;
    db_1.ORDERBOOK[stockSymbol][option][price].orders[userId] =
        (db_1.ORDERBOOK[stockSymbol][option][price].orders[userId] || 0) + quantity;
    if (type === 'buy') {
        db_1.INR_BALANCES[userId].locked += totalCost;
        db_1.INR_BALANCES[userId].balance -= totalCost;
    }
    else {
        if (!db_1.STOCK_BALANCES[userId][stockSymbol]) {
            db_1.STOCK_BALANCES[userId][stockSymbol] = { yes: { quantity: 0, locked: 0 }, no: { quantity: 0, locked: 0 } };
        }
        db_1.STOCK_BALANCES[userId][stockSymbol][option].locked += quantity;
        db_1.STOCK_BALANCES[userId][stockSymbol][option].quantity -= quantity;
    }
    return (0, api_util_1.sendResponse)(res, 200, { message: `Order placed successfully`, data: db_1.ORDERBOOK[stockSymbol] });
}));
exports.buyYes = placeOrder('buy', 'yes');
exports.sellYes = placeOrder('sell', 'yes');
exports.buyNo = placeOrder('buy', 'no');
exports.sellNo = placeOrder('sell', 'no');
exports.mintTokens = (0, api_util_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, stockSymbol, quantity } = req.body;
    if (!db_1.INR_BALANCES[userId]) {
        throw new AppError_1.default(404, "User not found");
    }
    if (!db_1.STOCK_BALANCES[userId]) {
        db_1.STOCK_BALANCES[userId] = {};
    }
    if (!db_1.STOCK_BALANCES[userId][stockSymbol]) {
        db_1.STOCK_BALANCES[userId][stockSymbol] = { yes: { quantity: 0, locked: 0 }, no: { quantity: 0, locked: 0 } };
    }
    db_1.STOCK_BALANCES[userId][stockSymbol].yes.quantity += quantity;
    db_1.STOCK_BALANCES[userId][stockSymbol].no.quantity += quantity;
    return (0, api_util_1.sendResponse)(res, 200, {
        message: `${quantity} tokens minted successfully for ${stockSymbol}`,
        data: db_1.STOCK_BALANCES[userId][stockSymbol]
    });
}));
