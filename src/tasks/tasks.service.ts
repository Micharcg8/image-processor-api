import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schemas';
import { CreateTaskDto } from './dto/create-task.dto';
import { downloadImageToLocal } from '../shared/utils/download-image';
import { getFileMd5 } from '../shared/utils/get-md5';
import { Image, ImageDocument } from '../images/schemas/image.schemas';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { originalPath } = createTaskDto;
    const price = parseFloat((Math.random() * (50 - 5) + 5).toFixed(2));

    const createdTask = new this.taskModel({
      status: 'pending',
      price,
      originalPath,
      images: [],
    });

    const savedTask = await createdTask.save();

    this.processTask(savedTask._id, originalPath).catch(console.error);

    return savedTask;
  }

  private async processTask(taskId: string, inputPath: string) {
    try {
      const isUrl = inputPath.startsWith('http');
      const fileName = path.basename(inputPath).split('.')[0];
      const ext = path.extname(inputPath).replace('.', '') || 'jpg';
      const inputDir = path.join(__dirname, '../../input');
      const outputBase = path.join(__dirname, '../../output', fileName);
      fs.mkdirSync(outputBase, { recursive: true });

      const localPath = isUrl
        ? await downloadImageToLocal(inputPath, inputDir)
        : inputPath;

      const resolutions = [1024, 800];
      const imageVariants = [];

      for (const width of resolutions) {
        const md5 = getFileMd5(localPath);
        const variantPath = path.join(outputBase, `${width}`, `${md5}.${ext}`);
        fs.mkdirSync(path.dirname(variantPath), { recursive: true });

        await sharp(localPath).resize({ width }).toFile(variantPath);

        const relativePath = variantPath.replace(
          path.resolve(__dirname, '../../'),
          '',
        );

        await this.imageModel.create({
          path: relativePath,
          resolution: width.toString(),
          md5,
        });

        imageVariants.push({
          resolution: width.toString(),
          path: relativePath,
        });
      }

      await this.taskModel.findByIdAndUpdate(taskId, {
        status: 'completed',
        images: imageVariants,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Error al procesar imagen:', error.message);
      } else {
        console.error('❌ Error al procesar imagen:', error);
      }
      await this.taskModel.findByIdAndUpdate(taskId, {
        status: 'failed',
      });
    }
  }
}
