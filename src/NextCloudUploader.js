import {
  Client,
  Server,
  CommandStatus,
  UploadFilesCommand,
} from "nextcloud-node-client";
import config from "config";
import { logger } from "./logger.js";

export class NextCloudUploader {
  constructor() {
    const server = new Server({
      basicAuth: {
        password:
          process.env.NEXTCLOUD_PASSWORD || config.get("NEXTCLOUD_PASSWORD"),
        username:
          process.env.NEXTCLOUD_USERNAME || config.get("NEXTCLOUD_USERNAME"),
      },
      url: process.env.NEXTCLOUD_URL || config.get("NEXTCLOUD_URL"),
    });
    this.client = new Client(server);
  }

  async uploadFile(sourceFileName, targetFileName) {
    const files = [
      {
        sourceFileName,
        targetFileName,
      },
    ];

    const uc = new UploadFilesCommand(this.client, { files });
    await uc.execute();
    const uploadResult = uc.getResultMetaData();

    this.uploadStatus = uc.getStatus();
    if (this.uploadStatus === CommandStatus.success) {
      logger.info(
        "File uploaded successfully with messages: " + uploadResult.messages
      );
      logger.info(uc.getBytesUploaded() + " total bytes uploaded to NextCloud");
    } else {
      logger.error("Errors during file upload: " + uploadResult.errors);
    }
  }
}
