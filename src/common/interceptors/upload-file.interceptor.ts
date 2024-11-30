import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

export function UploadFilesS3(filedName: string) {
  return class UploadUtility extends FileInterceptor(filedName, {
    storage: memoryStorage(),
  }) {};
}
