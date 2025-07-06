import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getModelToken } from '@nestjs/mongoose';
import { Task } from './schemas/task.schemas';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let taskModel: {
    create: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
  };

  const mockTask = {
    _id: '64e05f0c1234567890abcdef',
    originalPath: 'https://example.com/image.jpg',
    status: 'pending',
    price: 25.5,
    save: jest.fn().mockResolvedValue(this),
  };

  beforeEach(async () => {
    taskModel = {
      create: jest.fn().mockResolvedValue({
        ...mockTask,
        save: jest.fn().mockResolvedValue(mockTask),
      }),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: taskModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('create', () => {
    it('should create a task with random price and return it', async () => {
      const dto: CreateTaskDto = {
        originalPath: 'https://example.com/image.jpg',
      };

      const result = await service.create(dto);

      expect(taskModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });
  });

  describe('findById', () => {
    it('should return a task by ID', async () => {
      taskModel.findById.mockResolvedValue(mockTask);

      const result = await service.findById(mockTask._id);

      expect(taskModel.findById).toHaveBeenCalledWith(mockTask._id);
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task is not found', async () => {
      taskModel.findById.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        new NotFoundException('Task with ID invalid-id not found'),
      );
    });
  });
});
