import archiver from 'archiver';
import commandLineArgs from 'command-line-args';
import fs from 'fs'
import path from 'path';
import { IBackuprConfig, loadConfig } from './backupr_config_loader';
import { mongoDump } from './backupr_driver_mongo';
import { s3Receive } from './backupr_receiver_s3';
import { runScheduler } from './backupr_scheduled';

const optionDefinitions = [
    { name: 'immediate', alias: 'i', type: Boolean },
    { name: 'scheduled', alias: 's', type: Boolean },
]

const args = commandLineArgs(optionDefinitions)

async function execute(config: IBackuprConfig) {
    const payloadPath = path.join(__dirname, 'payload')
    const payloadZipPath = path.join(__dirname, 'payload.zip')

    // Clean out payload folder
    if (fs.existsSync(payloadPath)) {
        fs.rmSync(payloadPath, { recursive: true })
    }
    if (fs.existsSync(payloadZipPath)) {
        fs.rmSync(payloadZipPath, { recursive: true })
    }
    fs.mkdirSync(payloadPath)

    // Run all drivers
    for (const driver of config.drivers) {
        if (driver.type == "mongo") {
            await mongoDump(driver)
        }
    }

    // Tarball payload
    function zipDirectory(sourceDir: string, outPath: string) {
        const archive = archiver('zip');
        const stream = fs.createWriteStream(outPath);

        return new Promise<void>((resolve, reject) => {
            archive.pipe(stream);
            archive.glob('**/*', {cwd: sourceDir}).on('error', err => reject(err))
            stream.on('close', () => resolve());
            archive.finalize();
        });
    }

    try {
        await zipDirectory(payloadPath, payloadZipPath)
    }
    catch(error) {
        console.log(error)
        throw error
    }

    console.log('zipped...')

    // Run all receivers
    for (const receiver of config.receivers) {
        if (receiver.type == "s3") {
            await s3Receive(payloadZipPath, receiver)
        }
    }

    console.log('finish.')
}

const config = loadConfig();

if (args.immediate) {
    execute(config);
}

if (args.scheduled) {
    runScheduler(config, execute);
}