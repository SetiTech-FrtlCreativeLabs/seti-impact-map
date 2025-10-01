import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markNotificationAsRead(id);
  }

  @Post('read-all')
  async markAllAsRead(@Body() body: { userId: string }) {
    return this.notificationService.markAllNotificationsAsRead(body.userId);
  }
}
