import { Module } from '@nestjs/common';
import { InitiativeService } from './initiative.service';
import { InitiativeController } from './initiative.controller';

@Module({
  providers: [InitiativeService],
  controllers: [InitiativeController],
  exports: [InitiativeService],
})
export class InitiativeModule {}
