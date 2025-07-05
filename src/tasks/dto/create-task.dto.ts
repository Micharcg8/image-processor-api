import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { IsValidOriginalPath } from '../../shared/validators/is-valid-original-path';
import { Transform } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Validate(IsValidOriginalPath, {
    message:
      'originalPath must be a valid URL (http/https) or an existing local file path',
  })
  originalPath: string;
}
