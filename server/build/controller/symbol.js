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
exports.createSymbol = void 0;
const api_util_1 = require("../utils/api.util");
const db_1 = require("../db");
const AppError_1 = __importDefault(require("../utils/AppError"));
exports.createSymbol = (0, api_util_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stockSymbol } = req.params;
    if (!stockSymbol) {
        throw new AppError_1.default(400, "Symbol required");
    }
    if (db_1.STOCK_SYMBOLS[stockSymbol]) {
        throw new AppError_1.default(400, "Symbol is already taken");
    }
    db_1.STOCK_SYMBOLS[stockSymbol] = { stockSymbol };
    return (0, api_util_1.sendResponse)(res, 201, {
        message: `${stockSymbol} added successfully`,
        data: db_1.STOCK_SYMBOLS[stockSymbol],
    });
}));
