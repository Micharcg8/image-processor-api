import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ImagesModule } from './images/images.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [TasksModule, ImagesModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
