import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { InitiativeService } from './initiative.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('initiatives')
export class InitiativeController {
  constructor(private initiativeService: InitiativeService) {}

  @Get()
  async getAllInitiatives() {
    return this.initiativeService.getAllInitiatives();
  }

  @Get('search')
  async searchInitiatives(@Query('q') query: string) {
    return this.initiativeService.searchInitiatives(query);
  }

  @Get(':id')
  async getInitiativeById(@Param('id') id: string) {
    return this.initiativeService.getInitiativeById(id);
  }

  @Get('slug/:slug')
  async getInitiativeBySlug(@Param('slug') slug: string) {
    return this.initiativeService.getInitiativeBySlug(slug);
  }

  @Get(':id/updates')
  async getInitiativeUpdates(@Param('id') id: string) {
    return this.initiativeService.getInitiativeUpdates(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createInitiative(@Body() data: any) {
    return this.initiativeService.createInitiative(data);
  }

  @Post(':id/updates')
  @UseGuards(JwtAuthGuard)
  async createInitiativeUpdate(
    @Param('id') id: string,
    @Body() data: any,
    @Request() req,
  ) {
    return this.initiativeService.createInitiativeUpdate({
      ...data,
      initiativeId: id,
      authorId: req.user.userId,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateInitiative(@Param('id') id: string, @Body() data: any) {
    return this.initiativeService.updateInitiative(id, data);
  }
}
