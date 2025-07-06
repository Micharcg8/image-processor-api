import { ValidateObjectIdPipe } from './validate-object-id.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ValidateObjectIdPipe', () => {
  let pipe: ValidateObjectIdPipe;

  beforeEach(() => {
    pipe = new ValidateObjectIdPipe();
  });

  it('should return value if it is a valid MongoDB ObjectId', () => {
    const validId = '60c72b2f9b1d4c1dfc8b4567';
    expect(pipe.transform(validId)).toBe(validId);
  });

  it('should throw BadRequestException for invalid ObjectId', () => {
    const invalidId = '123-invalid-id';

    expect(() => pipe.transform(invalidId)).toThrow(BadRequestException);
  });
});
