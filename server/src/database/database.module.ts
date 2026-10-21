import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from '../config/configuration';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => ({
        uri: config.get('mongodbUri', { infer: true }),
        autoIndex: !config.get('isProduction', { infer: true }),
      }),
    }),
  ],
})
export class DatabaseModule {}
