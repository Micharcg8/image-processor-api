import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ValidateObjectIdPipe } from '../shared/pipes/validate-object-id.pipe';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Task } from '../domain/entities/task.entity';
import { TaskResponseDto } from './dto/task-response.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new image processing task' })
  @ApiResponse({
    status: 201,
    description: 'Task successfully created',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const task: Task = await this.tasksService.create(createTaskDto);
    return {
      taskId: task.id,
      status: task.status,
      price: task.price,
      originalPath: task.originalPath,
      images: task.images ?? [],
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task details by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Task found',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(
    @Param('id', ValidateObjectIdPipe) id: string,
  ): Promise<TaskResponseDto> {
    const task: Task = await this.tasksService.findById(id);
    return {
      taskId: task.id,
      status: task.status,
      price: task.price,
      originalPath: task.originalPath,
      images: task.images ?? [],
    };
  }

  @Get('/images/:id')
  @ApiOperation({ summary: 'Get processed images for a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Images for the task',
    schema: {
      example: {
        taskId: '64e05f0c1234567890abcdef',
        images: [
          { resolution: '800', path: '/output/img_800.jpg' },
          { resolution: '1024', path: '/output/img_1024.jpg' },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getImagesByTaskId(
    @Param('id', ValidateObjectIdPipe) id: string,
  ): Promise<{
    taskId: string;
    images: { resolution: string; path: string }[];
  }> {
    const task: Task = await this.tasksService.findById(id);
    return {
      taskId: task.id,
      images: task.images ?? [],
    };
  }
}
