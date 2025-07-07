/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  TaskRepository,
  TASK_REPOSITORY,
} from '../domain/repositories/task.repository';
import { Task } from '../domain/entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let repository: jest.Mocked<TaskRepository>;

  const mockTask = new Task(
    '123',
    'pending',
    15.5,
    'https://picsum.photos/200',
    [],
  );

  const mockRepository: jest.Mocked<TaskRepository> = {
    create: jest.fn().mockResolvedValue(mockTask),
    findById: jest.fn().mockResolvedValue(mockTask),
    save: jest.fn().mockResolvedValue(undefined),
    markAsCompleted: jest.fn().mockResolvedValue(undefined),
    markAsFailed: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TASK_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get(TASK_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task and start processing', async () => {
      const dto: CreateTaskDto = { originalPath: mockTask.originalPath };

      const result = await service.create(dto);

      expect(repository.create as jest.Mock).toHaveBeenCalledWith(
        expect.objectContaining({
          originalPath: dto.originalPath,
          status: 'pending',
        }),
      );

      expect(result).toEqual(mockTask);
    });
  });

  describe('findById', () => {
    it('should return a task if found', async () => {
      const result = await service.findById('123');
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      repository.findById.mockResolvedValueOnce(null);

      await expect(service.findById('not-found-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
