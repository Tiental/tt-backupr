import fs from "fs";
import path from "path";

import { exec, execFileSync, execSync } from "child_process";
import { IConfigDriver } from "./types";

export async function mysqlDump(mysqlDriverConfig: IConfigDriver) {
  const date = new Date();
  console.log(
    "Backupr initialized at " + date.toISOString() + " : " + date.valueOf()
  );

  // Get dumps directory
  const dumpsPath = path.join(__dirname, "payload", "mysql_dumps");

  // For each specified db archive
  console.log("Write backup files...");
  fs.mkdirSync(dumpsPath);
  const dbs = mysqlDriverConfig.dbList;
  for (let db of dbs) {
    // Get archive file
    const archiveFile = path.join(dumpsPath, `db_${db}_${date.valueOf()}.sql`);

    execSync(
      `mysqldump -u root -p${mysqlDriverConfig.dbPassword} ${db} > ${archiveFile}`
    );
  }

  console.log("Mysqldump finished.");
}
