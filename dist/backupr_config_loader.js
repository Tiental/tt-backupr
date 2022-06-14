"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function loadConfig() {
    const configPath = path_1.default.join(__dirname, '.backuprconfig.json');
    if (fs_1.default.existsSync(configPath) === false) {
        throw new Error('Backupr config not found!');
    }
    const configText = fs_1.default.readFileSync(configPath, { encoding: 'utf-8' });
    const configJSON = JSON.parse(configText);
    return configJSON;
}
exports.loadConfig = loadConfig;
