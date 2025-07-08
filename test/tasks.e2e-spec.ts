import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';

interface TaskResponse {
  taskId: string;
  status: 'pending' | 'completed' | 'failed';
  price: number;
  originalPath?: string;
  images?: { resolution: string; path: string }[];
}

describe('TasksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });

  const validPayload = {
    originalPath: 'https://picsum.photos/seed/testimage/800/600',
  };

  it('should create a task and return its summary', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send(validPayload)
      .expect(201);

    const body = response.body as TaskResponse;

    expect(body).toHaveProperty('taskId');
    expect(body.status).toBe('pending');
    expect(typeof body.price).toBe('number');
  });

  it('should return 400 for malformed ObjectId', async () => {
    const response = await request(app.getHttpServer())
      .get('/tasks/invalid-id')
      .expect(400);

    const body = response.body as { message: string };
    expect(body.message).toContain('Invalid ID format');
  });

  it('should return 404 if task not found', async () => {
    const nonExistentId = '64e05f0c1234567890abcdef';

    const response = await request(app.getHttpServer())
      .get(`/tasks/${nonExistentId}`)
      .expect(404);

    const body = response.body as { message: string };
    expect(body.message).toContain('Task with ID');
  });

  it('should process the task and return completed status with images', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send(validPayload)
      .expect(201);

    const created: TaskResponse = createRes.body as unknown as TaskResponse;
    const taskId = created.taskId;
    expect(taskId).toBeDefined();

    let processedTask: TaskResponse | null = null;
    const maxRetries = 15;
    const delay = 1000;

    for (let i = 0; i < maxRetries; i++) {
      const res: request.Response = await request(app.getHttpServer()).get(
        `/tasks/${taskId}`,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (res.status === 200 && res.body.status === 'completed') {
        processedTask = res.body as TaskResponse;
        break;
      }

      await new Promise((r) => setTimeout(r, delay));
    }

    expect(processedTask).not.toBeNull();

    if (!processedTask) {
      throw new Error(
        `❌ Task with ID ${taskId} did not complete after ${maxRetries * delay}ms`,
      );
    }

    expect(Array.isArray(processedTask.images)).toBe(true);
    expect(processedTask.images && processedTask.images.length).toBeGreaterThan(
      0,
    );
    expect(processedTask.images && processedTask.images[0]).toHaveProperty(
      'resolution',
    );
    expect(processedTask.images && processedTask.images[0]).toHaveProperty(
      'path',
    );
  }, 20000);
});
