import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { downloadImageToLocal } from '../shared/utils/download-image';
import { getFileMd5 } from '../shared/utils/get-md5';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import {
  TaskRepository,
  TASK_REPOSITORY,
} from '../domain/repositories/task.repository';
import { Task } from '../domain/entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { originalPath } = createTaskDto;
    const price = parseFloat((Math.random() * (50 - 5) + 5).toFixed(2));

    const createdTask = await this.taskRepository.create({
      status: 'pending',
      price,
      originalPath,
    });

    this.processTask(createdTask.id, originalPath).catch((error: unknown) => {
      console.error(
        '❌ Error al iniciar proceso:',
        error instanceof Error ? error.message : error,
      );
    });

    return createdTask;
  }

  async findById(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return task;
  }

  private async processTask(taskId: string, inputPath: string): Promise<void> {
    try {
      const task = await this.taskRepository.findById(taskId);
      if (!task) throw new Error(`Task ${taskId} not found`);

      const isUrl = inputPath.startsWith('http');
      const fileName = path.basename(inputPath).split('.')[0];
      const ext = path.extname(inputPath).replace('.', '') || 'jpg';
      const inputDir = path.join(__dirname, '../../../input');
      const outputBase = path.join(__dirname, '../../../output', fileName);

      fs.mkdirSync(outputBase, { recursive: true });

      const localPath = isUrl
        ? await downloadImageToLocal(inputPath, inputDir)
        : inputPath;

      const resolutions = [1024, 800];
      const imageVariants: { resolution: string; path: string }[] = [];

      for (const width of resolutions) {
        const md5 = getFileMd5(localPath);
        const outputPath = path.join(outputBase, `${width}`, `${md5}.${ext}`);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });

        await sharp(localPath).resize({ width }).toFile(outputPath);

        const relativePath = outputPath.replace(
          path.resolve(__dirname, '../../../'),
          '',
        );

        imageVariants.push({
          resolution: width.toString(),
          path: '/' + relativePath.replace(/\\/g, '/').replace(/^\/+/, ''),
        });
      }

      task.markAsCompleted(imageVariants);
      await this.taskRepository.save(task);
    } catch (error) {
      console.error(
        '❌ Error procesando imagen:',
        error instanceof Error ? error.message : error,
      );

      const task = await this.taskRepository.findById(taskId);
      if (task) {
        task.markAsFailed();
        await this.taskRepository.save(task);
      }
    }
  }
}
