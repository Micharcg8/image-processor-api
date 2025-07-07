import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schemas';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseTaskRepository } from '../infraestructure/repositories/mongoose-task.repository';
import { TASK_REPOSITORY } from '../domain/repositories/task.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TASK_REPOSITORY,
      useClass: MongooseTaskRepository,
    },
  ],
})
export class TasksModule {}
