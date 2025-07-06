import { IsValidOriginalPath } from './is-valid-original-path';
import * as fs from 'fs';

jest.mock('fs');

describe('IsValidOriginalPath', () => {
  const validator = new IsValidOriginalPath();

  it('should return true for a valid http URL', () => {
    expect(validator.validate('https://example.com/image.jpg')).toBe(true);
  });

  it('should return true for a local file that exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    expect(validator.validate('/some/local/path.jpg')).toBe(true);
  });

  it('should return false for a local file that does NOT exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(validator.validate('/bad/path.jpg')).toBe(false);
  });

  it('should return false for an invalid input', () => {
    expect(validator.validate(null as any)).toBe(false);
    expect(validator.validate(undefined as any)).toBe(false);
  });
});
