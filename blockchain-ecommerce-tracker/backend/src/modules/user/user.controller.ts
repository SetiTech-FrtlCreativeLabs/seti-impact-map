import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.findById(req.user.userId);
  }

  @Get('purchases')
  getUserPurchases(@Request() req) {
    return this.userService.getUserPurchases(req.user.userId);
  }

  @Put('profile')
  updateProfile(@Request() req, @Body() data: any) {
    return this.userService.updateUser(req.user.userId, data);
  }
}
