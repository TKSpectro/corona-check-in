import { UserRole } from '@corona-check-in/micro-service-shared';
import { Controller, Get, Request } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Get('me')
  async getProfile(@Request() req) {
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
}
