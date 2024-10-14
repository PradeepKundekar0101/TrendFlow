import { Response, Request } from "express";
import { catchAsync, sendResponse } from "../utils/api.util";
import { INR_BALANCES, STOCK_SYMBOLS } from "../db";
import AppError from "../utils/AppError";

export const createSymbol = catchAsync(async (req: Request, res: Response) => {
    const { stockSymbol } = req.params;
    if (!stockSymbol) {
        throw new AppError(400, "Symbol required");
    }
    if (STOCK_SYMBOLS[stockSymbol]) {
        throw new AppError(400, "Symbol is already taken");
    }
    STOCK_SYMBOLS[stockSymbol] = { stockSymbol };
    return sendResponse(res, 201, {
        message: `${stockSymbol} added successfully`,
        data: STOCK_SYMBOLS[stockSymbol],
    });
});
