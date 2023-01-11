import { Controller, Get, Request } from '@nestjs/common';
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

  @Get('me')
  getProfile(@Request() req) {
    return this.authService.me(req.user);
  }

  @Get('admin')
  @Roles(UserRole.ADMIN)
  getAdmin() {
    return { isAdmin: true };
  }

  @Get('admin-or-user')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getAdminOrUser() {
    return 'You are a admin or user';
  }

  @Get('/incidence')
  getIncidenceData() {
    return this.appService.getIncidenceData();
  }
}
