## Introduction
Backupr aims to be a simple, flexible and extensible utility to perform system backups.
Backupr consists of 3 concepts.
- Drivers (collects files to backup)
- Receivers (receives the single backup zip file)
- Notifiers (notifies end users about success/fail states)

*Notifiers are yet to be developed

If Backupr is missing something you can add your own implementations and recompile the source with typescript. Pull Requests to add implementations are appreciated.

Backupr currently supports :
###### Drivers
- MongoDB mongodump's
- MySQL dump
###### Receivers
- S3 Storage

## Setup
**Requirements** \
Backupr requires a NodeJS installation

**Install yarn package manager** \
Follow the installation instructions at:
https://classic.yarnpkg.com/en/

**Clone repository** \
```bash
git clone git@github.com:Tiental/backupr.git
```

**Install dependancies** \
```bash
cd backupr
```
```bash
yarn
```

**Configure** \
Copy example config file
```bash
cp example.backuprconfig.json ./dist/.backuprconfig.json
```
Edit config file
```bash
sudo nano ./dist/.backuprconfig.json
```

**Start Backupr** \
You can run Backupr with node in whatever way you wish
```bash
node ./dist/backupr.js --immediate
```

To run scheduled backups We recommend you use [Pm2](https://pm2.keymetrics.io/)
```bash
pm2 start ./dist/backupr.js -- --scheduled
```

## Example configuration
This example will run a daily backup at 01:00 UTC time
```json
{
    "schedule": {
        "hours": [
            1
        ],
        "minutes": [
            0
        ]
    },
    "drivers": [
        {
            "type": "mongo",
            "useToolsFolder": false,
            "dbList": [
                "db_to_backup"
            ]
        },
        {
            "type": "mysql",
            "useToolsFolder": false,
            "dbList": [
                "db_to_backup"
            ],
            "dbPassword": "db_password"
        }
    ],
    "receivers": [
        {
            "type": "s3",
            "accessKeyId": "accesskey",
            "secretAccessKey": "secret",
            "endpoint": "yourzone.yourendpoint.com",
            "bucket": "yourbucketname"
        }
    ]
}
```

**Schedule for weekly backup** \
This example will run a weekly backup on Mondays and Fridays at 01:00 UTC time
```json
"schedule": {
    "days": [
        1, 5
    ],
    "hours": [
        1
    ],
    "minutes": [
        0
    ]
}
```

**Schedule for hourly backup** \
This example will run a every hour
```json
"schedule": {
    "minutes": [
        0
    ]
}
```

## Contributing
To add a driver you can simply create a new file in the ```./src/``` folder named ```backuper_driver_****.ts```

Create a config interface that will match your options as defined in the  ```backuprconfig.json``` file.

Then create an exported async function which performs whatever tasks you need to. Ensure that your artifacts are copied or saved within the ```./dist/payload``` directory after your function has ran.

This directory will be zipped and sent to all your receivers

**TODO:** \
- Create a base class or interface for drivers and receivers so new implementations can simply extend those classes
- Build out notifiers