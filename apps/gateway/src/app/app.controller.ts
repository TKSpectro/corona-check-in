import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { UserEntity, UserRole } from '../users/user.entity';

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

  @Post('auth/login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/signup')
  @Public()
  async signup(@Body() user: UserEntity) {
    return this.authService.signup(user);
  }

  @Get('me')
  getProfile(@Request() req) {
    return req.user;
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
