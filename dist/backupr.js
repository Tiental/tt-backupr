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
const zip_dir_1 = __importDefault(require("zip-dir"));
const command_line_args_1 = __importDefault(require("command-line-args"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const backupr_config_loader_1 = require("./backupr_config_loader");
const backupr_driver_mongo_1 = require("./backupr_driver_mongo");
const backupr_receiver_s3_1 = require("./backupr_receiver_s3");
const backupr_scheduled_1 = require("./backupr_scheduled");
const optionDefinitions = [
    { name: 'immediate', alias: 'i', type: Boolean },
    { name: 'scheduled', alias: 's', type: Boolean },
];
const args = (0, command_line_args_1.default)(optionDefinitions);
function execute(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const payloadPath = path_1.default.join(__dirname, 'payload');
        const payloadZipPath = path_1.default.join(payloadPath, 'payload.zip');
        // Clean out payload folder
        if (fs_1.default.existsSync(payloadPath)) {
            fs_1.default.rmSync(payloadPath, { recursive: true });
        }
        fs_1.default.mkdirSync(payloadPath);
        // Run all drivers
        for (const driver of config.drivers) {
            if (driver.type == "mongo") {
                yield (0, backupr_driver_mongo_1.mongoDump)(driver);
            }
        }
        // Zip payload
        yield (0, zip_dir_1.default)(payloadPath, { saveTo: payloadZipPath });
        console.log('zipped...');
        // Run all receivers
        for (const receiver of config.receivers) {
            if (receiver.type == "s3") {
                yield (0, backupr_receiver_s3_1.s3Receive)(payloadZipPath, receiver);
            }
        }
        console.log('finish.');
    });
}
const config = (0, backupr_config_loader_1.loadConfig)();
if (args.immediate) {
    execute(config);
}
if (args.scheduled) {
    (0, backupr_scheduled_1.runScheduler)(config, execute);
}
