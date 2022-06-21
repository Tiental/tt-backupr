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
exports.mysqlDump = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
function mysqlDump(mysqlDriverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date();
        console.log("Backupr initialized at " + date.toISOString() + " : " + date.valueOf());
        // Get dumps directory
        const dumpsPath = path_1.default.join(__dirname, "payload", "mysql_dumps");
        // For each specified db archive
        console.log("Write backup files...");
        fs_1.default.mkdirSync(dumpsPath);
        const dbs = mysqlDriverConfig.dbList;
        for (let db of dbs) {
            // Get archive file
            const archiveFile = path_1.default.join(dumpsPath, `db_${db}_${date.valueOf()}.sql`);
            (0, child_process_1.execSync)(`mysqldump -u root -p${mysqlDriverConfig.dbPassword} ${db} > ${archiveFile}`);
        }
        console.log("Mysqldump finished.");
    });
}
exports.mysqlDump = mysqlDump;
