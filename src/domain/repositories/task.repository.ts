export const TASK_REPOSITORY = 'TaskRepository';

import { Task } from '../entities/task.entity';

export interface TaskRepository {
  create(task: Partial<Task>): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  save(task: Task): Promise<void>;
  markAsCompleted(
    id: string,
    images: { resolution: string; path: string }[],
  ): Promise<void>;
  markAsFailed(id: string): Promise<void>;
}
