import { Archiver } from "./Archiver.js";

const archiver = new Archiver();
await archiver.archiveDirectory("D:/Education/GoF/UML", "UML");
console.log("archiver result " + archiver.archivedSuccess);
