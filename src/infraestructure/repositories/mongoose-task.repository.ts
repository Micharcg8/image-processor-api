import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TaskDocument } from '../../tasks/schemas/task.schemas';
import { Task } from '../../domain/entities/task.entity';
import { TaskRepository } from '../../domain/repositories/task.repository';

@Injectable()
export class MongooseTaskRepository implements TaskRepository {
  constructor(
    @InjectModel('Task') private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(data: Partial<Task>): Promise<Task> {
    const created = new this.taskModel({
      status: data.status,
      price: data.price,
      originalPath: data.originalPath,
    });
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async findById(id: string): Promise<Task | null> {
    const found = await this.taskModel.findById(id).exec();
    return found ? this.toEntity(found) : null;
  }

  async save(task: Task): Promise<void> {
    await this.taskModel.findByIdAndUpdate(task.id, {
      status: task.status,
      originalPath: task.originalPath,
      price: task.price,
      images: task.images,
    });
  }

  async markAsCompleted(
    id: string,
    images: { resolution: string; path: string }[],
  ): Promise<void> {
    await this.taskModel.findByIdAndUpdate(id, {
      status: 'completed',
      images,
    });
  }

  async markAsFailed(id: string): Promise<void> {
    await this.taskModel.findByIdAndUpdate(id, {
      status: 'failed',
    });
  }

  private toEntity(doc: TaskDocument): Task {
    const id =
      doc._id instanceof Types.ObjectId
        ? doc._id.toHexString()
        : doc._id?.toString();

    if (!id) {
      throw new Error('Document _id is undefined');
    }

    return new Task(
      id,
      doc.status,
      doc.price,
      doc.originalPath,
      doc.images ?? [],
    );
  }
}
