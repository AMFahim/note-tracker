import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { SkipThrottle } from '@nestjs/throttler';
import { Connection } from 'mongoose';
import { Public } from '../../common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Public()
  @SkipThrottle()
  @Get()
  async check() {
    try {
      await this.connection.db!.admin().ping();
    } catch {
      throw new ServiceUnavailableException('Database unavailable');
    }
    return { status: 'ok', uptime: Math.round(process.uptime()) };
  }
}
