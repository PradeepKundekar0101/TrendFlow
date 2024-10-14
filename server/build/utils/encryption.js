"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'base64');
const iv = Buffer.from(process.env.IV, 'base64');
// Encrypting text
function encrypt(data) {
    let cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
// Decrypting text
function decrypt(data) {
    try {
        if (typeof data === "string") {
            const [ivHex, encryptedData] = data.split(':');
            if (encryptedData) {
                let iv = Buffer.from(ivHex, 'hex');
                let encryptedText = Buffer.from((encryptedData), 'hex');
                let decipher = crypto_1.default.createDecipheriv(algorithm, key, iv);
                let decrypted = decipher.update(encryptedText);
                decrypted = Buffer.concat([decrypted, decipher.final()]);
                return decrypted.toString();
            }
            return "";
        }
    }
    catch (error) {
        console.error('Decryption error:', error);
    }
}
