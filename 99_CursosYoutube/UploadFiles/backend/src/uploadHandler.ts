import busboy, { FileInfo } from "busboy";
import { Request, Response } from "express";
import { createWriteStream } from "fs";
import { IncomingHttpHeaders } from "http";
import { join } from "path";
import { Server } from "socket.io";
import { Readable } from "stream";
import { logger, pipelineAsync } from "./util";

class UploadHandler {
  private _io: Server;
  private _socketId: string;

  constructor(io: Server, socketId: string) {
    this._io = io;
    this._socketId = socketId;
  }

  options(req: Request, res: Response) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    });
  }

  registerEvents(headers: IncomingHttpHeaders, onFinish: () => void) {
    const bb = busboy({ headers });
    bb.on('file', this.onFile.bind(this))
    bb.on("finish", onFinish);
    return bb;
  }

  private async onFile(fieldName: string, stream: Readable, fileInfo: FileInfo) {
    if (!fileInfo.filename) {
      logger.warn(`Skipping empty file for field: ${fieldName}`);
      stream.resume(); // descarta o stream
      return;
    }

    const saveFileTo = join(__dirname, '../', 'download', fileInfo.filename);
    logger.info(`Uploading: ${saveFileTo}`);
    await pipelineAsync(
      stream,
      this.handleFileBytes(fileInfo).bind(this),
      createWriteStream(saveFileTo)
    );
  }

  private handleFileBytes(fileInfo: FileInfo) {
    const self = this;
    return async function* (source: AsyncIterable<Buffer>) {
      for await (const chunk of source) {
        const size = chunk.length;
        self._io.to(self._socketId).emit("file-uploaded", size);
        yield chunk;
      }
    };
  }
}
export default UploadHandler;