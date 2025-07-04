import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  status: 'pending' | 'completed' | 'failed';

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  originalPath: string;

  @Prop([
    {
      resolution: String,
      path: String,
    },
  ])
  images: { resolution: string; path: string }[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
