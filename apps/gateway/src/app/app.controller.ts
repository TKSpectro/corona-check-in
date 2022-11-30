import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/items')
  getItems() {
    return this.appService.getItems();
  }

  @Get('/items/:id')
  getItemById(@Param('id') id: number) {
    return this.appService.getItemById(id);
  }

  @Post('/items')
  createItem(@Body() { name }: { name: string }) {
    return this.appService.createItem({ name });
  }

  @Get('me')
  getProfile(@Request() req) {
    return this.authService.me(req.user);
  }

  @Get('admin')
  @Roles(UserRole.ADMIN)
  getAdmin() {
    return 'You are a admin';
  }

  @Get('/incidence')
  getIncidenceData() {
    return this.appService.getIncidenceData();
  }
}
