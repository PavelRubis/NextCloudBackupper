import fs from "fs";
import archiver from "archiver";
import { logger } from "./logger.js";

export class Archiver {
  #onStreamClose(archive) {
    this.archivedSuccess = true;
    logger.info(archive.pointer() + " total bytes archived");
    logger.info(
      "archiver has been finalized and the output file descriptor has closed."
    );
  }

  #onArchiveError(err) {
    this.archivedSuccess = false;
    logger.error("Errors during archiving: " + err);
  }

  archiveDirectory(directoryPath, archivePathAndFileName) {
    const validDirectoryPath = directoryPath.endsWith("/")
      ? directoryPath
      : directoryPath + "/";

    const archive = archiver("zip");
    return new Promise((resolve, reject) => {
      const fStream = fs.createWriteStream(archivePathAndFileName + ".zip");
      archive.on("warning", (err) => {
        if (err.code === "ENOENT") {
          logger.warn(err);
        } else {
          reject(err);
        }
      });
      archive.on("error", (err) => reject(err));
      archive.directory(validDirectoryPath, false);
      archive.pipe(fStream);

      fStream.on("close", () => resolve());
      archive.finalize();
    })
      .then(() => this.#onStreamClose(archive))
      .catch((err) => this.#onArchiveError(err));
  }
}
