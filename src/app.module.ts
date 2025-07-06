import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { ImagesModule } from './images/images.module';
import { SharedModule } from './shared/shared.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        console.log('🔗 Connecting to MongoDB:', uri);
        return { uri };
      },
      inject: [ConfigService],
    }),
    TasksModule,
    ImagesModule,
    SharedModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'output'),
      serveRoot: '/output',
    }),
  ],
})
export class AppModule {}
