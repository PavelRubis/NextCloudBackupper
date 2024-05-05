import Client, {
  CommandResultMetaData,
  CommandStatus,
  UploadFilesCommand,
  SourceTargetFileNames,
} from "nextcloud-node-client";
import config from "config";
import logger from "./logger";

class NextCloudUploader {
  constructor() {
    const server = new Server({
      basicAuth: {
        password: config.get("NEXTCLOUD_PASSWORD"),
        username: config.get("NEXTCLOUD_USERNAME"),
      },
      url: config.get("NEXTCLOUD_HOST_URL"),
    });
    this.client = new Client(server);
  }

  uploadFile(sourceFileName, targetFileName) {
    (async () => {
      const client = new Client();

      // create a list of files to upload
      const files = [
        {
          sourceFileName,
          targetFileName,
        },
        // add even more files ...
      ];

      // create the command object
      const uc = new UploadFilesCommand(client, { files });

      // start the upload synchronously
      await uc.execute();

      // use the result to do the needful
      const uploadResult = uc.getResultMetaData();

      if (uc.getStatus() === CommandStatus.success) {
        logger.info(uploadResult.messages);
        logger.info(uc.getBytesUploaded());
      } else {
        logger.error(uploadResult.errors);
      }
    })();
  }
}
