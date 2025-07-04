import { Body, Controller, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskDocument } from './schemas/task.schemas';

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
}
