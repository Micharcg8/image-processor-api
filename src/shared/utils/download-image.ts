import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export async function downloadImageToLocal(
  url: string,
  destFolder: string,
): Promise<string> {
  const response = await axios.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Accept: 'image/*,*/*;q=0.8',
    },
  });

  const headers = response.headers as Record<string, string | undefined>;
  const contentType = headers['content-type'] ?? '';
  const ext = contentType.split('/')[1] || 'jpg';
  const fileName = `downloaded.${ext}`;
  const destPath = path.join(destFolder, fileName);

  fs.mkdirSync(destFolder, { recursive: true });
  fs.writeFileSync(destPath, Buffer.from(response.data));
  return destPath;
}
