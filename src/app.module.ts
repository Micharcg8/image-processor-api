import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { SharedModule } from './shared/shared.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');

        if (!uri) {
          throw new Error(
            '❌ MONGODB_URI is not defined in environment variables',
          );
        }
        console.log('🔗 Connecting to MongoDB:', uri);
        try {
          await mongoose.connect(uri);
          Logger.log('✅ MongoDB connected successfully');
        } catch (error) {
          Logger.error('❌ Failed to connect to MongoDB', error);
        }
        return { uri };
      },
      inject: [ConfigService],
    }),

    TasksModule,
    SharedModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'output'),
      serveRoot: '/output',
    }),
  ],
})
export class AppModule {}
