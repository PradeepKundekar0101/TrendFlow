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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePositionsInSupabase = updatePositionsInSupabase;
exports.updatePositionsInMongo = updatePositionsInMongo;
const user_1 = __importDefault(require("../models/user"));
const broker_1 = __importDefault(require("../services/broker"));
const position_1 = __importDefault(require("../models/position"));
const supabase_js_1 = require("@supabase/supabase-js");
const BATCH_SIZE = 10;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
// Assuming you have these environment variables set
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
function retry(fn_1) {
    return __awaiter(this, arguments, void 0, function* (fn, retries = MAX_RETRIES) {
        try {
            return yield fn();
        }
        catch (error) {
            if (retries > 0) {
                yield new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return retry(fn, retries - 1);
            }
            throw error;
        }
    });
}
function updatePositionsInSupabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_1.default.find({
                isBrokerConnected: true,
                role: "trader",
                dhan_auth_token: { $ne: undefined },
                dhan_client_id: { $ne: undefined }
            });
            console.log("Total users to process:", users.length);
            for (let i = 0; i < users.length; i += BATCH_SIZE) {
                const userBatch = users.slice(i, i + BATCH_SIZE);
                yield processBatch(userBatch);
                console.log(`Processed batch ${i / BATCH_SIZE + 1} of ${Math.ceil(users.length / BATCH_SIZE)}`);
            }
        }
        catch (error) {
            console.error('Error updating positions and funds in Supabase:', error);
        }
    });
}
function processBatch(userBatch) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Processing batch of", userBatch.length, "users");
        const batchUpdates = yield Promise.all(userBatch.map((user) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("Fetching positions for user:", user._id.toString());
                const positions = yield retry(() => broker_1.default.getPositions(user._id.toString()));
                console.log("Positions fetched for user", user._id.toString(), "Count:", ((_a = positions.data) === null || _a === void 0 ? void 0 : _a.length) || 0);
                const funds = yield retry(() => broker_1.default.getFundsData(user._id.toString()));
                return { user, positions, funds };
            }
            catch (error) {
                console.error(`Error processing user ${user._id}:`, error);
                return { user, positions: { status: 'error', data: [] }, funds: { data: null } };
            }
        })));
        yield supabaseClient.rpc('begin_transaction');
        try {
            for (const { user, positions, funds } of batchUpdates) {
                if (positions.status === 'success' && positions.data) {
                    const positionUpsertData = positions.data.map(position => {
                        var _a, _b, _c;
                        return ({
                            user_id: user._id.toString(),
                            user_firstname: user.firstName,
                            user_lastname: user.lastName,
                            mentor_id: (_a = user.mentorId) === null || _a === void 0 ? void 0 : _a.toString(),
                            profile_image_url: user.profile_image_url,
                            dhan_client_id: position.dhanClientId,
                            trading_symbol: position.tradingSymbol,
                            security_id: position.securityId,
                            balance: ((_b = funds === null || funds === void 0 ? void 0 : funds.data) === null || _b === void 0 ? void 0 : _b.availabelBalance) || ((_c = funds === null || funds === void 0 ? void 0 : funds.data) === null || _c === void 0 ? void 0 : _c.availableBalance),
                            position_type: position.positionType,
                            exchange_segment: position.exchangeSegment,
                            product_type: position.productType,
                            buy_avg: position.buyAvg,
                            buy_qty: position.buyQty,
                            cost_price: position.costPrice,
                            sell_avg: position.sellAvg,
                            sell_qty: position.sellQty,
                            net_qty: position.netQty,
                            realized_profit: position.realizedProfit,
                            unrealized_profit: position.unrealizedProfit,
                            rbi_reference_rate: position.rbiReferenceRate,
                            multiplier: position.multiplier,
                            carry_forward_buy_qty: position.carryForwardBuyQty,
                            carry_forward_sell_qty: position.carryForwardSellQty,
                            carry_forward_buy_value: position.carryForwardBuyValue,
                            carry_forward_sell_value: position.carryForwardSellValue,
                            day_buy_qty: position.dayBuyQty,
                            day_sell_qty: position.daySellQty,
                            day_buy_value: position.dayBuyValue,
                            day_sell_value: position.daySellValue,
                            drv_expiry_date: position.drvExpiryDate,
                            drv_option_type: position.drvOptionType,
                            drv_strike_price: position.drvStrikePrice,
                            cross_currency: position.crossCurrency,
                        });
                    });
                    const uniquePositions = Array.from(new Set(positionUpsertData.map(p => JSON.stringify(p)))).map((p) => JSON.parse(p));
                    for (const position of uniquePositions) {
                        const { error } = yield supabaseClient
                            .from('positions')
                            .upsert(position, { onConflict: 'user_id,security_id' });
                        if (error) {
                            console.error('Error upserting position:', error, 'Position:', position);
                            throw error; // This will trigger a rollback
                        }
                    }
                    const securityIds = uniquePositions.map((p) => p.security_id);
                    const formattedSecurityIds = securityIds.map((id) => `'${id}'`).join(',');
                    const { error: deleteError } = yield supabaseClient
                        .from('positions')
                        .delete()
                        .eq('user_id', user._id.toString())
                        .not('security_id', 'in', `(${formattedSecurityIds})`);
                    if (deleteError) {
                        console.error(`Error deleting old positions for user ${user._id}:`, deleteError);
                        throw deleteError; // This will trigger a rollback
                    }
                }
            }
            yield supabaseClient.rpc('commit_transaction');
        }
        catch (error) {
            console.error('Error in batch processing, rolling back:', error);
            yield supabaseClient.rpc('rollback_transaction');
            throw error;
        }
    });
}
function updatePositionsInMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_1.default.find({ isBrokerConnected: true, role: "trader", dhan_auth_token: { $ne: undefined }, dhan_client_id: { $ne: undefined } });
            console.log("Total users to process in MongoDB:", users.length);
            for (const user of users) {
                try {
                    const positions = yield retry(() => broker_1.default.getPositions(user._id.toString()));
                    if (positions.status === 'success' && positions.data) {
                        yield position_1.default.deleteMany({ userId: user._id });
                        const newPositions = positions.data.map(position => {
                            const { userId } = position, positionWithoutUserId = __rest(position, ["userId"]);
                            return new position_1.default(Object.assign({ userId: user._id }, positionWithoutUserId));
                        });
                        yield position_1.default.insertMany(newPositions);
                        console.log(`Updated ${newPositions.length} positions for user ${user._id}`);
                    }
                }
                catch (error) {
                    console.error(`Error processing positions for user ${user._id}:`, error);
                }
            }
            console.log("Positions updated in MongoDB");
        }
        catch (error) {
            console.error('Error updating positions in MongoDB:', error);
        }
    });
}
