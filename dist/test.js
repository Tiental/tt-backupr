os = require('os')
path = require('path')
archiver = require('archiver')
fs = require('fs')
async function run() {
    function zipDirectory(sourceDir, outPath) {
        const archive = archiver('zip');
        const stream = fs.createWriteStream(outPath);

        return new Promise((resolve, reject) => {
            archive.pipe(stream);
            archive.glob('**/*', { cwd: sourceDir }).on('error', err => reject(err))
            stream.on('close', () => { console.log('close stream'); resolve() });
            archive.finalize();
        });
    }

    try {
        await zipDirectory(path.join(__dirname, 'test'), path.join(__dirname, 'test.zip'))
    }
    catch (error) {
        console.log(error)
        throw error
    }
}

run()