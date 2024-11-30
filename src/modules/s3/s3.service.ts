import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { extname } from "path";
import {
  S3_ACCESS_KEY,
  S3_BUCKET_NAME,
  S3_ENDPOINT,
  S3_SECRET_KEY,
} from "src/common/constant/s3.const";

@Injectable()
export class S3Service {
  private readonly s3: S3;
  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
      },
      endpoint: S3_ENDPOINT,
      region: "default",
    });
  }

  async uploadFile(file: Express.Multer.File, folderName: string) {
    const ext = extname(file.originalname);
    return await this.s3
      .upload({
        Bucket: S3_BUCKET_NAME,
        Key: `${folderName}/${Date.now()}${ext}`,
        Body: file.buffer,
      })
      .promise();
  }
  async deleteFile(Key: string) {
    return await this.s3
      .deleteObject({
        Bucket: S3_BUCKET_NAME,
        Key: decodeURI(Key),
      })
      .promise();
  }
}
