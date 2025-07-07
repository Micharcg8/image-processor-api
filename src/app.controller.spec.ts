/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { CreateTaskDto } from './tasks/dto/create-task.dto';
import { Task } from './domain/entities/task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let service: jest.Mocked<TasksService>;

  const mockTask: Task = new Task(
    'fake-id',
    'pending',
    19.99,
    'https://picsum.photos/200',
    [
      { resolution: '800', path: '/output/example.jpg' },
      { resolution: '1024', path: '/output/example2.jpg' },
    ],
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTask),
            findById: jest.fn().mockResolvedValue(mockTask),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return task summary after creation', async () => {
      const dto: CreateTaskDto = { originalPath: mockTask.originalPath };

      expect(service.create).toBeDefined();
      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        taskId: mockTask.id,
        status: mockTask.status,
        price: mockTask.price,
      });
    });
  });

  describe('findOne', () => {
    it('should return full task details', async () => {
      const result = await controller.findOne(mockTask.id);

      expect(service.findById).toHaveBeenCalledWith(mockTask.id);
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
    it('should return images only', async () => {
      const result = await controller.getImagesByTaskId(mockTask.id);

      expect(service.findById).toHaveBeenCalledWith(mockTask.id);
      expect(result).toEqual({
        taskId: mockTask.id,
        images: mockTask.images,
      });
    });
  });
});
