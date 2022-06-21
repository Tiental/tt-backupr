import fs from 'fs'
import path from 'path';

import { exec, execFileSync } from 'child_process';
import { IConfigDriver } from "./types";

export async function mongoDump(mongoDriverConfig: IConfigDriver) {

    const date = new Date()
    console.log('Backupr initialized at ' + date.toISOString() + ' : ' + date.valueOf())

    // Get dumps directory
    const dumpsPath = path.join(__dirname, 'payload', 'mongo_dumps')

    // Get mongodump path
    const mongodumpPath = path.join(__dirname, '../', 'mongotools', 'mongodump.exe')

    // For each specified db archive
    console.log('Write backup files...')
    fs.mkdirSync(dumpsPath)
    const dbs = mongoDriverConfig.dbList;
    for (let db of dbs) {
        // Get archive file
        const archiveFile = path.join(dumpsPath, `db_${db}_${date.valueOf()}.backup`)
        if (mongoDriverConfig.useToolsFolder == true) {
            // Run backup command
            execFileSync(
                mongodumpPath,
                [
                    `--db=${db}`,
                    `--archive=${archiveFile}`
                ],
            );
        } else {
            exec(`mongodump --db=${db} --archive=${archiveFile}`)
        }
    }

    console.log('MongoDump finished.')
}
