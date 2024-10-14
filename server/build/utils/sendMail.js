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
exports.verifyPhoneOTP = exports.sendPhoneOTP = exports.sendmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const AppError_1 = __importDefault(require("./AppError"));
const twilio_client_1 = require("../config/twilio.client");
// import logo from "/images/logo.png";
const serviceId = process.env.TWILIO_AUTH_SID;
const sendmail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
    const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>Welcome Email</title>
  </head>
  <body>
    <center>
      <div style="width: 100%; background:black;">
        <img height="200" src="https://earningedge.in/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-14-at-00.58.40_ff66f444.jpg" alt="" />
      </div>
    </center>
    <h1>${mailOptions.subject}</h1>
    <p>${mailOptions.text}</p><br />
    <p>Sincerely,<br><b>The Earning Edge Team<b></p>
  </body>
  </html>
  `;
    mailOptions.html = htmlTemplate;
    try {
        yield transporter.sendMail(mailOptions);
    }
    catch (err) {
        console.log(err.message);
        throw new AppError_1.default(400, err.message);
    }
});
exports.sendmail = sendmail;
const sendPhoneOTP = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield twilio_client_1.client.verify.v2.services(serviceId).verifications.create({ to: phoneNumber, channel: "sms" });
        console.log(res);
    }
    catch (error) {
        console.log(error);
        console.log(error);
    }
});
exports.sendPhoneOTP = sendPhoneOTP;
const verifyPhoneOTP = (phoneNumber, code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield twilio_client_1.client.verify.v2.services(serviceId).verificationChecks.create({ to: phoneNumber, code });
        console.log(res);
        return res;
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
exports.verifyPhoneOTP = verifyPhoneOTP;
