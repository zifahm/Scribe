import * as S3 from "aws-sdk/clients/s3";
import { Arg, Mutation, Resolver } from "type-graphql";
import { FileInfo } from "./fileInfo";
import { S3Payload } from "./s3Payload";
@Resolver()
export class SignS3 {
  @Mutation(() => [S3Payload])
  async signS3(@Arg("fileInfo", () => [FileInfo]) fileInfo: [FileInfo]) {
    const s3 = new S3({
      region: "ap-south-1",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      signatureVersion: "v4"
    });
    const s3Payload: Array<{
      signedUrl: string;
      fileType: string;
      originalName: string;
    }> = [];
    console.log(fileInfo, "fileinfo input");
    fileInfo.map(async (info: FileInfo) => {
      const params = {
        ACL: "private",
        Bucket: "scribecushion.com/studioImages",
        Key: info.name,
        Expires: 60,
        ContentType: info.type
      };

      const url = await s3.getSignedUrl("putObject", params);
      console.log(url, "single url signed");
      s3Payload.push({
        signedUrl: url,
        fileType: info.type,
        originalName: info.originalName
      });
    });

    return s3Payload;
  }
}
