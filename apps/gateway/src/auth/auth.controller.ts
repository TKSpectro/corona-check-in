import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { SignupUserDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  @Public()
  async signup(@Body() user: SignupUserDto) {
    return this.authService.signup(user);
  }
}
