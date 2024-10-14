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
exports.getStockData = void 0;
exports.upsertPositions = upsertPositions;
exports.upsertHoldings = upsertHoldings;
const axios_1 = __importDefault(require("axios"));
const holding_1 = __importDefault(require("../models/holding"));
const position_1 = __importDefault(require("../models/position"));
function upsertPositions(userId, positionsData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Get all the positions of the user
            const existingPositions = yield position_1.default.find({ userId });
            const positionsToRemove = existingPositions.filter((existingPosition) => {
                return !positionsData.some((apiHolding) => apiHolding.exchangeSegment === existingPosition.exchangeSegment &&
                    apiHolding.tradingSymbol === existingPosition.tradingSymbol &&
                    apiHolding.securityId === existingPosition.securityId);
            });
            if (positionsToRemove.length > 0) {
                yield position_1.default.deleteMany({
                    _id: { $in: positionsToRemove.map((h) => h._id) },
                });
                console.log(`${positionsToRemove.length} stale positions removed.`);
            }
            for (const position of positionsData) {
                yield position_1.default.findOneAndUpdate({
                    userId,
                    tradingSymbol: position.tradingSymbol,
                    dhanClientId: position.dhanClientId,
                    securityId: position.securityId,
                }, {
                    $set: {
                        positionType: position.positionType,
                        exchangeSegment: position.exchangeSegment,
                        productType: position.productType,
                        buyAvg: position.buyAvg,
                        buyQty: position.buyQty,
                        costPrice: position.costPrice,
                        sellAvg: position.sellAvg,
                        sellQty: position.sellQty,
                        netQty: position.netQty,
                        realizedProfit: position.realizedProfit,
                        unrealizedProfit: position.unrealizedProfit,
                        rbiReferenceRate: position.rbiReferenceRate,
                        multiplier: position.multiplier,
                        carryForwardBuyQty: position.carryForwardBuyQty,
                        carryForwardSellQty: position.carryForwardSellQty,
                        carryForwardBuyValue: position.carryForwardBuyValue,
                        carryForwardSellValue: position.carryForwardSellValue,
                        dayBuyQty: position.dayBuyQty,
                        daySellQty: position.daySellQty,
                        dayBuyValue: position.dayBuyValue,
                        daySellValue: position.daySellValue,
                        drvExpiryDate: position.drvExpiryDate,
                        drvOptionType: position.drvOptionType,
                        drvStrikePrice: position.drvStrikePrice,
                        crossCurrency: position.crossCurrency,
                    },
                }, { upsert: true, new: true });
            }
            console.log("Positions upserted successfully.");
        }
        catch (error) {
            console.error("Error upserting positions:", error);
        }
    });
}
function upsertHoldings(userId, holdingsData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get all the holdings of the user
            const existingHoldings = yield holding_1.default.find({ userId });
            const holdingsToRemove = existingHoldings.filter((existingHolding) => {
                return !holdingsData.some((apiHolding) => apiHolding.exchange === existingHolding.exchange &&
                    apiHolding.tradingSymbol === existingHolding.tradingSymbol &&
                    apiHolding.securityId === existingHolding.securityId);
            });
            if (holdingsToRemove.length > 0) {
                yield holding_1.default.deleteMany({
                    _id: { $in: holdingsToRemove.map((h) => h._id) },
                });
                console.log(`${holdingsToRemove.length} stale holdings removed.`);
            }
            for (const holding of holdingsData) {
                yield holding_1.default.findOneAndUpdate({
                    userId,
                    tradingSymbol: holding.tradingSymbol,
                    exchange: holding.exchange,
                    securityId: holding.securityId,
                }, {
                    $set: {
                        isin: holding.isin,
                        totalQty: holding.totalQty,
                        dpQty: holding.dpQty,
                        t1Qty: holding.t1Qty,
                        availableQty: holding.availableQty,
                        collateralQty: holding.collateralQty,
                        avgCostPrice: holding.avgCostPrice,
                    },
                }, { upsert: true, new: true });
            }
            console.log("Holdings upserted successfully.");
        }
        catch (error) {
            console.error("Error upserting holdings:", error);
        }
    });
}
const getStockData = (symbol, exchange) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}.${exchange}&apikey=${apiKey}`;
    try {
        const response = yield axios_1.default.get(url);
        const data = response.data;
        return { symbol, data };
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
});
exports.getStockData = getStockData;
