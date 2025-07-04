import { IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  originalPath: string;
}
