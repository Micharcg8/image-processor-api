import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as fs from 'fs';
import * as path from 'path';

@ValidatorConstraint({ name: 'isValidOriginalPath', async: false })
export class IsValidOriginalPath implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (typeof value !== 'string' || !value.trim()) {
      return false;
    }

    if (this.isValidUrl(value)) {
      return true;
    }

    const resolvedPath = path.resolve(value);
    return fs.existsSync(resolvedPath);
  }

  private isValidUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return 'originalPath must be a valid HTTP(S) URL or an existing local file path.';
  }
}
