
import { Request, Response } from "express";
import { catchAsync, sendResponse } from "../utils/api.util";
import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from "../db";
import AppError from "../utils/AppError";

const placeOrder = (type: 'buy' | 'sell', option: 'yes' | 'no') => 
  catchAsync(async (req: Request, res: Response) => {
    const { userId, stockSymbol, quantity, price } = req.body;

    if (!INR_BALANCES[userId]) {
      throw new AppError(404, "User not found");
    }

    if (!ORDERBOOK[stockSymbol]) {
      throw new AppError(404, "Stock symbol not found");
    }

    const totalCost = quantity * price;

    if (type === 'buy' && INR_BALANCES[userId].balance < totalCost) {
      throw new AppError(400, "Insufficient balance");
    }

    if (type === 'sell' && (!STOCK_BALANCES[userId]?.[stockSymbol]?.[option] || 
        STOCK_BALANCES[userId][stockSymbol][option].quantity < quantity)) {
      throw new AppError(400, "Insufficient stock balance");
    }

    if (!ORDERBOOK[stockSymbol][option][price]) {
      ORDERBOOK[stockSymbol][option][price] = { total: 0, orders: {} };
    }

    ORDERBOOK[stockSymbol][option][price].total += quantity;
    ORDERBOOK[stockSymbol][option][price].orders[userId] = 
      (ORDERBOOK[stockSymbol][option][price].orders[userId] || 0) + quantity;

    if (type === 'buy') {
      INR_BALANCES[userId].locked += totalCost;
      INR_BALANCES[userId].balance -= totalCost;
    } else {
      if (!STOCK_BALANCES[userId][stockSymbol]) {
        STOCK_BALANCES[userId][stockSymbol] = { yes: { quantity: 0, locked: 0 }, no: { quantity: 0, locked: 0 } };
      }
      STOCK_BALANCES[userId][stockSymbol][option].locked += quantity;
      STOCK_BALANCES[userId][stockSymbol][option].quantity -= quantity;
    }

    return sendResponse(res, 200, { message: `Order placed successfully`, data: ORDERBOOK[stockSymbol] });
  });

export const buyYes = placeOrder('buy', 'yes');
export const sellYes = placeOrder('sell', 'yes');
export const buyNo = placeOrder('buy', 'no');
export const sellNo = placeOrder('sell', 'no');

export const mintTokens = catchAsync(async (req: Request, res: Response) => {
  const { userId, stockSymbol, quantity } = req.body;

  if (!INR_BALANCES[userId]) {
    throw new AppError(404, "User not found");
  }

  if (!STOCK_BALANCES[userId]) {
    STOCK_BALANCES[userId] = {};
  }

  if (!STOCK_BALANCES[userId][stockSymbol]) {
    STOCK_BALANCES[userId][stockSymbol] = { yes: { quantity: 0, locked: 0 }, no: { quantity: 0, locked: 0 } };
  }

  STOCK_BALANCES[userId][stockSymbol].yes.quantity += quantity;
  STOCK_BALANCES[userId][stockSymbol].no.quantity += quantity;

  return sendResponse(res, 200, { 
    message: `${quantity} tokens minted successfully for ${stockSymbol}`,
    data: STOCK_BALANCES[userId][stockSymbol]
  });
});