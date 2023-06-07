import OSS from "ali-oss";
import { OSS_CONFIG } from "@src/config/config.database";

const client = new OSS(OSS_CONFIG);

// 上传文件
export async function baseUpload(filename: string, data: Buffer) {
  try {
    const result = await client.put(filename, data);
    return result.url || "";
  } catch (err) {
    throw new Error(err);
  }
}
