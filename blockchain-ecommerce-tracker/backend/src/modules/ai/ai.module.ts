import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AIService } from './ai.service';
import { AIProcessor } from './ai.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'ai-queue',
    }),
  ],
  providers: [AIService, AIProcessor],
  exports: [AIService],
})
export class AIModule {}
