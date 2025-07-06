import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as fs from 'fs';
import * as path from 'path';

@ValidatorConstraint({ name: 'isValidOriginalPath', async: false })
export class IsValidOriginalPath implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (!value || typeof value !== 'string') return false;

    if (value.startsWith('http://') || value.startsWith('https://')) {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }

    const fullPath = path.resolve(value);
    return fs.existsSync(fullPath);
  }

  defaultMessage() {
    return `originalPath must be a valid URL or an existing file path`;
  }
}
