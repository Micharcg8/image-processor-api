import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongooseTaskRepository } from './mongoose-task.repository';
import { TaskDocument } from '../../tasks/schemas/task.schemas';
import { Task } from '../../domain/entities/task.entity';

describe('MongooseTaskRepository', () => {
  let repository: MongooseTaskRepository;

  const mockTaskDoc: Partial<TaskDocument> = {
    _id: 'task-id',
    status: 'pending',
    price: 10,
    originalPath: 'https://picsum.photos/200',
    images: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongooseTaskRepository,
        {
          provide: getModelToken('Task'),
          useValue: {
            findById: jest.fn().mockResolvedValue(mockTaskDoc),
            findByIdAndUpdate: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get(MongooseTaskRepository);
    repository = module.get(MongooseTaskRepository);
  });
  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', function (this: void) {
    it('should create and return a Task entity', async function (this: void) {
      const saveMock = jest.fn().mockResolvedValue({
        _id: 'task-id',
        status: 'pending',
        price: 10,
        originalPath: 'https://picsum.photos/200',
        images: [],
      });

      const constructorMock = jest.fn().mockImplementation(() => ({
        save: saveMock,
      }));

      const module = await Test.createTestingModule({
        providers: [
          {
            provide: getModelToken('Task'),
            useValue: Object.assign(constructorMock, {
              findById: jest.fn(),
              findByIdAndUpdate: jest.fn(),
            }),
          },
          MongooseTaskRepository,
        ],
      }).compile();

      const repo = module.get(MongooseTaskRepository);

      const result = await repo.create({
        status: 'pending',
        price: 10,
        originalPath: 'https://picsum.photos/200',
      });

      expect(constructorMock).toHaveBeenCalledWith({
        status: 'pending',
        price: 10,
        originalPath: 'https://picsum.photos/200',
      });

      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(
        new Task('task-id', 'pending', 10, 'https://picsum.photos/200', []),
      );
    });
  });

  describe('create', () => {
    it('should create and return a Task entity', async () => {
      const saveMock = jest.fn().mockResolvedValue({
        _id: 'task-id',
        status: 'pending',
        price: 10,
        originalPath: 'https://picsum.photos/200',
        images: [],
      });

      const constructorMock = jest.fn().mockImplementation(() => ({
        save: saveMock,
      }));

      const module = await Test.createTestingModule({
        providers: [
          {
            provide: getModelToken('Task'),
            useValue: Object.assign(constructorMock, {
              findById: jest.fn(),
              findByIdAndUpdate: jest.fn(),
            }),
          },
          MongooseTaskRepository,
        ],
      }).compile();

      const repo = module.get(MongooseTaskRepository);

      const result = await repo.create({
        status: 'pending',
        price: 10,
        originalPath: 'https://picsum.photos/200',
      });

      expect(constructorMock).toHaveBeenCalledWith({
        status: 'pending',
        price: 10,
        originalPath: 'https://picsum.photos/200',
      });

      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(
        new Task('task-id', 'pending', 10, 'https://picsum.photos/200', []),
      );
    });
  });
});
