import * as crypto from 'crypto';
import * as fs from 'fs';

export function getFileMd5(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(buffer).digest('hex');
}
