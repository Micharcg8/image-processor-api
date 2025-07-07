/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from '../domain/entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksController', () => {
  let controller: TasksController;
  let mockTasksService: jest.Mocked<TasksService>;

  const mockTask = new Task(
    '64e05f0c1234567890abcdef',
    'pending',
    12.34,
    'https://example.com/image.jpg',
    [],
  );

  beforeEach(async () => {
    mockTasksService = {
      create: jest.fn().mockResolvedValue(mockTask),
      findById: jest.fn().mockResolvedValue(mockTask),
      taskRepository: {},
      processTask: jest.fn(),
    } as unknown as jest.Mocked<TasksService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return created task details', async () => {
      const dto: CreateTaskDto = { originalPath: mockTask.originalPath };

      const result = await controller.create(dto);

      expect(mockTasksService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        taskId: mockTask.id,
        status: mockTask.status,
        price: mockTask.price,
      });
    });
  });

  describe('findOne', () => {
    it('should return a task by ID', async () => {
      const result = await controller.findOne(mockTask.id);

      expect(mockTasksService.findById).toHaveBeenCalledWith(mockTask.id);
      expect(result).toEqual({
        taskId: mockTask.id,
        status: mockTask.status,
        price: mockTask.price,
        originalPath: mockTask.originalPath,
        images: mockTask.images,
      });
    });
  });

  describe('getImagesByTaskId', () => {
    it('should return images from a task', async () => {
      const result = await controller.getImagesByTaskId(mockTask.id);

      expect(mockTasksService.findById).toHaveBeenCalledWith(mockTask.id);
      expect(result).toEqual({
        taskId: mockTask.id,
        images: mockTask.images,
      });
    });

    it('should throw NotFoundException if task is not found', async () => {
      mockTasksService.findById.mockRejectedValueOnce(
        new NotFoundException('Task not found'),
      );

      await expect(controller.getImagesByTaskId('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
