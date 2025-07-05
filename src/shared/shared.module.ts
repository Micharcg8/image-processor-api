import { Module } from '@nestjs/common';
import { IsValidOriginalPath } from './validators/is-valid-original-path';

@Module({
  providers: [IsValidOriginalPath],
  exports: [IsValidOriginalPath],
})
export class SharedModule {}
