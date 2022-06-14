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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScheduler = void 0;
function sleep(time) {
    return new Promise(res => setTimeout(res, time));
}
let lastRun = (new Date()).valueOf();
function shouldRun(configSchedule) {
    const date = new Date();
    if (lastRun > date.valueOf() - 1000) {
        return false;
    }
    if (date.getUTCSeconds() !== 0) {
        return false;
    }
    if (configSchedule.days) {
        if (configSchedule.days.includes(date.getUTCDay()) === false) {
            return false;
        }
    }
    if (configSchedule.hours) {
        if (configSchedule.hours.includes(date.getUTCHours()) === false) {
            return false;
        }
    }
    if (configSchedule.minutes) {
        if (configSchedule.minutes.includes(date.getUTCMinutes()) === false) {
            return false;
        }
    }
    lastRun = date.valueOf();
    return true;
}
let checkInterval = 200;
function runScheduler(config, func) {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            if (shouldRun(config.schedule)) {
                yield func(config);
            }
            yield sleep(checkInterval);
        }
    });
}
exports.runScheduler = runScheduler;
