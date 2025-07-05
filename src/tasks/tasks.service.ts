import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schemas';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { downloadImageToLocal } from '../shared/utils/download-image';
import { getFileMd5 } from '../shared/utils/get-md5';
import { NotFoundException } from '@nestjs/common';

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

    const savedTask = (await createdTask.save()) as TaskDocument;

    this.processTask((savedTask._id as string).toString(), originalPath).catch(
      (error: unknown) => {
        if (error instanceof Error) {
          console.error('❌ Error al iniciar proceso:', error.message);
        } else {
          console.error('❌ Error al iniciar proceso:', error);
        }
      },
    );

    return savedTask;
  }

  async findById(taskId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return task;
  }

  private async processTask(taskId: string, inputPath: string): Promise<void> {
    try {
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

      await this.taskModel.findByIdAndUpdate(taskId, {
        status: 'completed',
        images: imageVariants,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Error procesando imagen:', error.message);
      } else {
        console.error('❌ Error inesperado:', error);
      }

      await this.taskModel.findByIdAndUpdate(taskId, {
        status: 'failed',
      });
    }
  }
}
