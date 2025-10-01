import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  async getHealth() {
    return this.healthService.getHealthStatus();
  }

  @Get('ready')
  async getReadiness() {
    const health = await this.healthService.getHealthStatus();
    return {
      ready: health.status === 'healthy',
      ...health,
    };
  }

  @Get('live')
  async getLiveness() {
    return { alive: true, timestamp: new Date().toISOString() };
  }
}
