import fs from 'fs'
import AWS from 'aws-sdk';

export interface IConfigReceiverS3 {
    type: string,
    accessKeyId: string,
    secretAccessKey: string,
    endpoint: string,
    bucket: string,
}

export async function s3Receive(payloadZipPath: string, receiverConfig: IConfigReceiverS3) {
    console.log('Upload backup files...')

    const s3 = new AWS.S3({
        accessKeyId: receiverConfig.accessKeyId,
        secretAccessKey: receiverConfig.secretAccessKey,
        endpoint: receiverConfig.endpoint
    });

    // Read archive file
    const fileContent = fs.readFileSync(payloadZipPath);
    const key = (new Date()).valueOf() + '_' + 'payload.zip';

    return new Promise<void>((resolve, reject) => {
        s3.upload(
            {
                Bucket: receiverConfig.bucket,
                Key: key,
                Body: fileContent,
            },
            function (err: any, data: any) {
                if (err) {
                    throw err;
                }
                
                console.log(`File uploaded successfully. ${data.Location}`);
                resolve();
            }
        );
    })
}
