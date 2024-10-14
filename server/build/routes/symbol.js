"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.symbolRouter = void 0;
const express_1 = __importDefault(require("express"));
const symbol_1 = require("../controller/symbol");
exports.symbolRouter = express_1.default.Router();
exports.symbolRouter.post("/create/:stockSymbol", symbol_1.createSymbol);
