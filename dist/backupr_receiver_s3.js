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
exports.s3Receive = void 0;
const fs_1 = __importDefault(require("fs"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
function s3Receive(payloadZipPath, receiverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Upload backup files...');
        const s3 = new aws_sdk_1.default.S3({
            accessKeyId: receiverConfig.accessKeyId,
            secretAccessKey: receiverConfig.secretAccessKey,
            endpoint: receiverConfig.endpoint
        });
        // Read archive file
        const fileContent = fs_1.default.readFileSync(payloadZipPath);
        const key = (new Date()).valueOf() + '_' + 'payload.zip';
        return new Promise((resolve, reject) => {
            s3.upload({
                Bucket: receiverConfig.bucket,
                Key: key,
                Body: fileContent,
            }, function (err, data) {
                if (err) {
                    throw err;
                }
                console.log(`File uploaded successfully. ${data.Location}`);
                resolve();
            });
        });
    });
}
exports.s3Receive = s3Receive;
