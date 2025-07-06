import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { IsValidOriginalPath } from '../../shared/validators/is-valid-original-path';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Image source path (URL or local path)',
    example: 'https://picsum.photos/seed/testimage/800/600',
  })
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
