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
exports.checkNotifications = void 0;
const journal_1 = __importDefault(require("../models/journal"));
const notification_1 = __importDefault(require("../models/notification"));
const user_1 = __importDefault(require("../models/user"));
const checkNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const journals = yield journal_1.default.find({
        reviewId: null,
        createdAt: { $gte: twentyFourHoursAgo, $lte: new Date() }
    }).populate('userId');
    const userIds = journals.map(journal => journal.userId);
    const users = yield user_1.default.find({ _id: { $in: userIds } });
    for (const user of users) {
        const notification = yield notification_1.default.create({
            title: `${user.firstName} has submitted the journal, please review it`,
            description: "Description",
            mentor_receipt: user.mentorId || null,
        });
        yield notification.save();
        console.log("Notification created:", notification);
    }
});
exports.checkNotifications = checkNotifications;
