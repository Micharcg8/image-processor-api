import * as fs from 'fs';
import * as crypto from 'crypto';
import { getFileMd5 } from './get-md5';

jest.mock('fs');
jest.mock('crypto');

describe('getFileMd5', () => {
  it('should return md5 hash of file contents', () => {
    const mockBuffer = Buffer.from('test-content');
    const mockHash = {
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('mocked-md5-hash'),
    };

    (fs.readFileSync as jest.Mock).mockReturnValue(mockBuffer);
    (crypto.createHash as jest.Mock).mockReturnValue(mockHash);

    const result = getFileMd5('fake/path/image.jpg');
    expect(mockHash.update).toHaveBeenCalledWith(mockBuffer);
    expect(result).toBe('mocked-md5-hash');
  });
});
