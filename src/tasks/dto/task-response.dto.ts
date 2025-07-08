import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({
    example: '64e05f0c1234567890abcdef',
    description: 'Unique identifier for the task',
  })
  taskId: string;

  @ApiProperty({
    example: 'pending',
    description: 'Current status of the task',
  })
  status: 'pending' | 'completed' | 'failed';

  @ApiProperty({
    example: 12.34,
    description: 'Price calculated for processing the image',
  })
  price: number;

  @ApiProperty({
    example: 'https://picsum.photos/seed/testimage/800/600',
    description: 'Original image path (URL or local path)',
  })
  originalPath: string;

  @ApiProperty({
    example: [
      { resolution: '800', path: '/output/img_800.jpg' },
      { resolution: '1024', path: '/output/img_1024.jpg' },
    ],
    description: 'Processed images with their resolutions and paths',
  })
  images: { resolution: string; path: string }[];
}
