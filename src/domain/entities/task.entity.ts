export type TaskStatus = 'pending' | 'completed' | 'failed';

export interface TaskImage {
  resolution: string;
  path: string;
}

export class Task {
  constructor(
    public readonly id: string,
    public status: TaskStatus,
    public price: number,
    public originalPath: string,
    public images: TaskImage[] = [],
  ) {}

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isFailed(): boolean {
    return this.status === 'failed';
  }

  markAsCompleted(images: TaskImage[]): void {
    this.status = 'completed';
    this.images = images;
  }

  markAsFailed(): void {
    this.status = 'failed';
  }
}
