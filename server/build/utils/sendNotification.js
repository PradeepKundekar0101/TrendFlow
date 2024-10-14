"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onesignalNotification = void 0;
const OneSignal = __importStar(require("@onesignal/node-onesignal"));
const onesignalNotification = (
//@ts-ignore
notificationObject) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, notificationContent } = notificationObject;
    const ONESIGNAL_APPID = process.env.ONESIGNAL_APPID;
    const ONESIGNAL_RESTAPI = process.env.ONESIGNAL_RESTAPI;
    const configParams = {
        userAuthKey: ONESIGNAL_APPID,
        restApiKey: ONESIGNAL_RESTAPI,
    };
    const configuration = OneSignal.createConfiguration(configParams);
    const onesignalClient = new OneSignal.DefaultApi(configuration);
    const notification = new OneSignal.Notification();
    notification.app_id = String(ONESIGNAL_APPID);
    notification.headings = {
        //@ts-ignore
        en: notificationContent.title,
    };
    notification.contents = {
        //@ts-ignore
        en: notificationContent.message,
    };
    notification.target_channel = "push";
    notification.include_aliases = {
        //@ts-ignore
        external_id: [userId],
    };
    const notificationResponse = yield onesignalClient.createNotification(notification);
    return notificationResponse;
});
exports.onesignalNotification = onesignalNotification;
