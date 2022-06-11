import fs from 'fs'
import path from 'path';
import { IConfigDriverMongo } from './backupr_driver_mongo';
import { IConfigReceiverS3 } from './backupr_receiver_s3';

export interface IBackuprConfig {
    drivers: Array<IConfigDriverMongo>,
    receivers: Array<IConfigReceiverS3>,
}

export function loadConfig(): IBackuprConfig {
    const configPath = path.join(__dirname, '.backuprconfig.json');
    if (fs.existsSync(configPath) === false) {
        throw new Error('Backupr config not found!');
    }

    const configText = fs.readFileSync(configPath, { encoding: 'utf-8'})
    const configJSON = JSON.parse(configText);
    return configJSON
}
