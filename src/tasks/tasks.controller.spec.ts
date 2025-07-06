import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { NotFoundException } from '@nestjs/common';
import { TaskDocument } from './schemas/task.schemas';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTask: Partial<TaskDocument> = {
    _id: '64e05f0c1234567890abcdef',
    status: 'pending',
    price: 12.34,
    originalPath: 'https://example.com/image.jpg',
    images: [],
  };

  const mockTasksService = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return created task details', async () => {
      const dto: CreateTaskDto = {
        originalPath: 'https://example.com/image.jpg',
      };

      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(dto);

      expect(mockTasksService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        taskId: mockTask._id,
        status: mockTask.status,
        price: mockTask.price,
      });
    });
  });

  describe('findOne', () => {
    it('should return a task by ID', async () => {
      mockTasksService.findById.mockResolvedValue(mockTask);

      const result = await controller.findOne(mockTask._id as string);

      expect(mockTasksService.findById).toHaveBeenCalledWith(mockTask._id);
      expect(result).toEqual(mockTask);
    });
  });

  describe('getImagesByTaskId', () => {
    it('should return images from a task', async () => {
      mockTasksService.findById.mockResolvedValue(mockTask);

      const result = await controller.getImagesByTaskId(mockTask._id as string);

      expect(result).toEqual({
        taskId: mockTask._id,
        images: [],
      });
    });

    it('should throw NotFoundException if task is not found', async () => {
      mockTasksService.findById.mockResolvedValue(null);

      await expect(controller.getImagesByTaskId('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
