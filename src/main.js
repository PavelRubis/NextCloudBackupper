import { Archiver } from "./Archiver.js";
import { NextCloudUploader } from "./NextCloudUploader.js";
import { logger } from "./Logger.js";

let dirToUploadPath = "";
process.argv.forEach((arg) => {
  const argNameAndValue = arg.split("=");
  if (
    argNameAndValue.length == 2 &&
    argNameAndValue[0] === "directoryPath" &&
    argNameAndValue[1]
  ) {
    dirToUploadPath = argNameAndValue[1];
  }
});

if (!dirToUploadPath) {
  logger.error("Path of directory to upload is not provided");
} else {
  const archiver = new Archiver();
  await archiver.archiveDirectory(dirToUploadPath, "n8ndata");
  console.log("archiver result " + archiver.archivedSuccess);

  const uploader = new NextCloudUploader();
  await uploader.uploadFile("./n8ndata.zip", "/n8n_backup/n8ndata.zip");
  console.log("uploader result " + uploader.uploadStatus);
}
