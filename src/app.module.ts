import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/interview-ai'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
