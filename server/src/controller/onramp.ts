import {  Response,Request } from "express";
import { catchAsync, sendResponse } from "../utils/api.util";
import {INR_BALANCES} from "../db"
import AppError from "../utils/AppError";

export const onrampInr = catchAsync(async(req:Request,res:Response)=>{
    const {userId,amount} = req.body
    const balance = INR_BALANCES;
    if(!balance[userId]){
        throw new AppError(404,"User not found")
    }
    const amount_Rs = amount/1000
    if(amount_Rs<0) throw new AppError(400,"Invalid amount")
    balance[userId].balance+=amount_Rs
    return sendResponse(res,200,{message:`${amount_Rs} added successfully`,data:balance[userId]})
})