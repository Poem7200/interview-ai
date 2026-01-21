import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/interview-ai'),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'interview-ai-secret-key',
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') || '7d' },
      }),
      inject: [ConfigService],
      global: true,
    }),
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
