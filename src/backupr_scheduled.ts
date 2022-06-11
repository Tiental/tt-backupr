function sleep (time: number): Promise<void> {
    return new Promise(res => setTimeout(res, time));
}

interface IConfigSchedule {
    days: number[],
    hours: number[],
    minutes: number[]
}

let lastRun = (new Date()).valueOf()
function shouldRun(configSchedule: IConfigSchedule) {
    const date = new Date()

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

let checkInterval = 200
export async function runScheduler(config: IConfigSchedule, func: () => {}) {
    while (true) {
        if (shouldRun(config)) {
            func()
        }
        await sleep(checkInterval)
    }
}
