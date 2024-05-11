import { Archiver } from "./Archiver.js";
import { NextCloudUploader } from "./NextCloudUploader.js";

const archiver = new Archiver();
await archiver.archiveDirectory("/home/<username>/n8n_backups/n8n_data/", "n8ndata");
console.log("archiver result " + archiver.archivedSuccess);

const uploader = new NextCloudUploader();
await uploader.uploadFile("./n8ndata.zip", "/n8n_backup/n8ndata.zip");
console.log("uploader result " + uploader.uploadStatus);
