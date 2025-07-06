import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskDocument } from './schemas/task.schemas';
import { ValidateObjectIdPipe } from '../shared/pipes/validate-object-id.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const task: TaskDocument = await this.tasksService.create(createTaskDto);
    return {
      taskId: task._id,
      status: task.status,
      price: task.price,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.tasksService.findById(id);
  }

  @Get('/images/:id')
  async getImagesByTaskId(@Param('id', ValidateObjectIdPipe) id: string) {
    const task: TaskDocument | null = await this.tasksService.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return {
      taskId: id,
      images: task.images ?? [],
    };
  }
}
