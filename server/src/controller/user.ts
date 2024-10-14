import {  Response,Request } from "express";
import { catchAsync, sendResponse } from "../utils/api.util";
import {USERS,INR_BALANCES} from "../db"
import AppError from "../utils/AppError";

export const createUser = catchAsync(async(req:Request,res:Response)=>{
    const {userId} = req.params;
    if(USERS[userId]){
        throw new AppError(409,"User already exists")
    }
    USERS[userId] = {userId};
    INR_BALANCES[userId]={balance:0,locked:0}
    return sendResponse(res,201,{data:USERS[userId]})
})
