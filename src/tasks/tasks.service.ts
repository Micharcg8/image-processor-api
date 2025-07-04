import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schemas';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    const { originalPath } = createTaskDto;
    const price = parseFloat((Math.random() * (50 - 5) + 5).toFixed(2));

    const createdTask = new this.taskModel({
      status: 'pending',
      price,
      originalPath,
      images: [],
    });

    return createdTask.save();
  }
}
