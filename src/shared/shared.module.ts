import { Module } from '@nestjs/common';
import { IsValidOriginalPath } from './validators/is-valid-original-path';
import { ValidateObjectIdPipe } from './pipes/validate-object-id.pipe';

@Module({
  providers: [IsValidOriginalPath, ValidateObjectIdPipe],
  exports: [IsValidOriginalPath, ValidateObjectIdPipe],
})
export class SharedModule {}
